# Google Sign-In Setup

## What Works

- Native Google Sign-In on iOS using `@react-native-google-signin/google-signin`
- Supports adult and minor (14+) Google accounts
- Requires a development build (`npx expo run:ios`) — does NOT work in Expo Go

---

## What Didn't Work (and Why)

### expo-auth-session / expo-auth-session v7
- Used `Google.useAuthRequest` with `useProxy: true` to route through `https://auth.expo.io`
- `useProxy` was removed in expo-auth-session v7 — the option is silently ignored
- Without the proxy, the redirect URI becomes `exp://192.168.1.253:8081` (local IP), which Google rejects with **Error 400: invalid_request**
- Google does not accept `exp://` or local IP redirect URIs

### Wrong Client IDs
- A linter auto-filled client IDs belonging to a different app ("PivotForward")
- Always create your own credentials in Google Cloud Console

---

## Working Solution

### Package
```
npx expo install @react-native-google-signin/google-signin
```

### app.json
```json
{
  "plugins": [
    ["@react-native-google-signin/google-signin", {
      "iosUrlScheme": "com.googleusercontent.apps.YOUR_IOS_CLIENT_ID"
    }]
  ],
  "ios": {
    "bundleIdentifier": "com.ec2ai.focusmav"
  },
  "android": {
    "package": "com.ec2ai.focusmav"
  }
}
```

### ios/FocusMav/Info.plist
The plugin should add the URL scheme automatically, but if it doesn't (e.g. the `ios/` folder already existed before the plugin was added), manually add it to `CFBundleURLTypes`:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>focusmav</string>
      <string>com.ec2ai.focusmav</string>
      <string>com.googleusercontent.apps.YOUR_IOS_CLIENT_ID</string>
    </array>
  </dict>
</array>
```

The `iosUrlScheme` is the iOS client ID with `com.googleusercontent.apps.` prepended, e.g.:
```
com.googleusercontent.apps.YOUR_IOS_CLIENT_ID
```

### contexts/auth.tsx
```ts
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',  // used on Android
  iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',  // used on iOS
});

const userInfo = await GoogleSignin.signIn();
```

---

## Google Cloud Console Setup

1. Create a project at https://console.cloud.google.com
2. APIs & Services → OAuth consent screen → External → add test users
3. APIs & Services → Credentials → Create OAuth 2.0 Client IDs:

| Client Type | Settings |
|---|---|
| Web | Authorized redirect URI: `https://auth.expo.io/@YOUR_EXPO_USERNAME/FocusMav` |
| iOS | Bundle ID: `com.ec2ai.focusmav` |
| Android | Package: `com.ec2ai.focusmav` + SHA-1 fingerprint |

### Get Android debug SHA-1

**IMPORTANT: Expo uses a local keystore, NOT the global one.** The debug build is signed with `android/app/debug.keystore`, not `~/.android/debug.keystore`. These are different files with different keys. Using the wrong SHA-1 causes `DEVELOPER_ERROR` at runtime.

**Method 1 — From the built APK (most reliable):**

Build the app first (`npx expo run:android`), then extract the SHA-1 from the actual APK:
```bash
# Use the correct build-tools version for your project
$(ANDROID_HOME)/build-tools/36.1.0/apksigner verify --print-certs \
  android/app/build/outputs/apk/debug/app-debug.apk | grep SHA-1
```

**Method 2 — From the local keystore:**
```bash
keytool -list -v -keystore android/app/debug.keystore -alias androiddebugkey \
  -storepass android -keypass android | grep SHA1
```

**Method 3 — From the global keystore (may NOT match the build):**
```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey \
  -storepass android -keypass android | grep SHA1
```

To check which keystore the build uses, look at `android/app/build.gradle`:
```groovy
signingConfigs {
    debug {
        storeFile file('debug.keystore')  // relative to android/app/
    }
}
```

Requires Java 17. Install with: `brew install --cask temurin@17`

---

## Auth Flow (expo-router)

- `app/login.tsx` — login screen, uses `<Redirect href="/(tabs)" />` when user is set
- `app/(tabs)/_layout.tsx` — uses `<Redirect href="/login" />` when user is null
- `contexts/auth.tsx` — `AuthProvider` wraps the root layout, exposes `user`, `signInWithGoogle`, `signOut`
- `app/_layout.tsx` — wraps everything in `<AuthProvider>`

No `unstable_settings.anchor` — removed because it caused the app to bypass the auth check by starting directly at `(tabs)`.

---

## Environment Requirements

| Tool | Required Version |
|---|---|
| Java | 17 (not 25 — Gradle rejects class file major version 69) |
| expo-auth-session | Not used — removed |
| @react-native-google-signin/google-signin | Latest |
| Build method | `npx expo run:ios` or `npx expo run:android` (not Expo Go) |

Set Java 17 as default:
```bash
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
```

---

## Credential Security

### Problem
OAuth client IDs were initially hardcoded in `contexts/auth.tsx`, `app.json`, and `docs/`. These were committed and pushed to a public GitHub repo.

### How We Fixed It

**1. Move secrets to `.env` (gitignored):**

Create a `.env` file in the project root (never committed):
```
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
```

Expo SDK 54+ reads `EXPO_PUBLIC_*` vars from `.env` automatically — no extra packages needed.

**2. Reference env vars in code:**

`contexts/auth.tsx`:
```ts
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!;
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID!;
```

**3. Convert `app.json` → `app.config.js` for dynamic values:**

`app.json` doesn't support env vars. Convert to `app.config.js`:
```js
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '';
const iosUrlScheme = iosClientId
  ? `com.googleusercontent.apps.${iosClientId.replace('.apps.googleusercontent.com', '')}`
  : '';

export default {
  expo: {
    // ...
    plugins: [
      ['@react-native-google-signin/google-signin', { iosUrlScheme }],
    ],
  },
};
```

**4. Add `.env` to `.gitignore` and provide `.env.example`:**

`.gitignore`:
```
.env
.env*.local
```

`.env.example` (committed, with placeholder values):
```
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
```

**5. Rotate credentials (recommended):**

Since the old client IDs were pushed to a public repo, they exist in git history even after removal. To fully invalidate them:
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Delete the old Web, iOS, and Android OAuth clients
3. Create new ones with the same settings
4. Update `.env` and `google-services.json` with the new IDs
5. Rebuild both iOS and Android

### Files That Should Never Be Committed
| File | Contains | Gitignored? |
|---|---|---|
| `.env` | OAuth client IDs | Yes |
| `android/app/google-services.json` | Android client ID, API key | Yes (via `/android`) |
| `ios/` | Info.plist with iOS URL scheme | Yes (via `/ios`) |
