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
com.googleusercontent.apps.149436588546-o1e3gokl61q91kon989fucjmm2uj1ccf
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
```
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android | grep SHA1
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
