# Expo Router Folder Structure Guide

## 📁 Current Folder Structure

This Expo app uses **Expo Router** with **file-based routing**. Here's what each folder does:

### `/app` - Main Application Directory (File-Based Routing)
This is where your screens and navigation structure live. Expo Router automatically creates routes based on file structure.

```
app/
├── _layout.tsx          # Root layout - wraps entire app, sets up Stack navigator
├── (tabs)/              # Tab group (parentheses = route group, not in URL)
│   ├── _layout.tsx      # Tab navigator layout - defines bottom tabs
│   ├── index.tsx        # Home tab screen (route: /)
│   └── explore.tsx      # Explore tab screen (route: /explore)
└── modal.tsx            # Modal screen (route: /modal)
```

**Key Concepts:**
- `_layout.tsx` files define navigation structure (Stack, Tabs, etc.)
- `index.tsx` is the default route for a folder
- `(tabs)` uses parentheses, making it a route group (doesn't appear in URL)
- File names become routes automatically

### `/components` - Reusable Components
Shared React components used across your app.

```
components/
├── themed-text.tsx      # Themed text component
├── themed-view.tsx      # Themed view component
├── haptic-tab.tsx       # Tab button with haptic feedback
└── ui/                  # UI component library
    └── collapsible.tsx
```

### `/constants` - App Constants
Theme colors, configuration values, etc.

### `/hooks` - Custom React Hooks
Reusable hooks like `useColorScheme`, `useThemeColor`

### `/assets` - Static Assets
Images, fonts, and other static files

---

## 🔄 How to Import Components from Another Project

### Step 1: Copy Components to This Project

**Option A: Copy Individual Components**
1. Copy component files from your other project to `/components` folder
2. Copy any dependencies (hooks, utilities, types) they need
3. Update import paths

**Option B: Copy Entire Component Folders**
If you have a well-organized component structure, copy entire folders:
```
components/
├── navigation/          # Your navigation components
├── screens/            # Screen components
└── shared/              # Shared components
```

### Step 2: Update Import Paths

This project uses **path aliases** configured in `tsconfig.json`:
- `@/*` maps to the project root

**Before (from other project):**
```typescript
import { MyComponent } from '../components/MyComponent';
import { useCustomHook } from '../../hooks/useCustomHook';
```

**After (in this project):**
```typescript
import { MyComponent } from '@/components/MyComponent';
import { useCustomHook } from '@/hooks/useCustomHook';
```

### Step 3: Install Missing Dependencies

Check what packages your imported components need:
```bash
# Check your other project's package.json
# Then install missing packages here:
npm install <package-name>
```

Common dependencies you might need:
- `@react-navigation/*` packages (already installed)
- UI libraries (React Native Paper, NativeBase, etc.)
- State management (Redux, Zustand, etc.)
- Form libraries (React Hook Form, Formik, etc.)

### Step 4: Update Navigation Structure

#### If you have a Tab Navigator:

**Replace `/app/(tabs)/_layout.tsx`** with your tab structure:

```typescript
import { Tabs } from 'expo-router';
import { YourTabComponent } from '@/components/navigation/YourTabComponent';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Your tab options
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <YourIconComponent color={color} />,
        }}
      />
      {/* Add more tabs */}
    </Tabs>
  );
}
```

#### If you have a Stack Navigator:

**Update `/app/_layout.tsx`** to match your navigation:

```typescript
import { Stack } from 'expo-router';
import { YourStackComponent } from '@/components/navigation/YourStackComponent';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Add more screens */}
    </Stack>
  );
}
```

### Step 5: Migrate Screen Components

Replace the example screens in `/app/(tabs)/` with your actual screens:

```typescript
// app/(tabs)/index.tsx
import { YourHomeScreen } from '@/components/screens/YourHomeScreen';

export default function HomeScreen() {
  return <YourHomeScreen />;
}
```

---

## 📝 Migration Checklist

- [ ] Copy component files to `/components`
- [ ] Copy hooks to `/hooks` (if needed)
- [ ] Copy constants to `/constants` (if needed)
- [ ] Copy assets to `/assets` (if needed)
- [ ] Update all import paths to use `@/` alias
- [ ] Install missing npm packages
- [ ] Update navigation layouts (`_layout.tsx` files)
- [ ] Replace example screens with your screens
- [ ] Test that all imports resolve correctly
- [ ] Check for TypeScript errors
- [ ] Verify navigation works correctly

---

## 🎯 Common Import Patterns

### Importing Components
```typescript
import { MyComponent } from '@/components/MyComponent';
import { Button } from '@/components/ui/Button';
```

### Importing from Screens
```typescript
import { HomeScreen } from '@/components/screens/HomeScreen';
```

### Importing Hooks
```typescript
import { useCustomHook } from '@/hooks/useCustomHook';
```

### Importing Constants
```typescript
import { Colors } from '@/constants/theme';
```

### Importing Assets
```typescript
import logo from '@/assets/images/logo.png';
```

---

## ⚠️ Important Notes

1. **Expo Router is file-based**: Routes are created from file structure, not code
2. **Layout files are special**: `_layout.tsx` files define navigation, not screens
3. **Route groups**: Folders with `(parentheses)` don't appear in URLs
4. **Index files**: `index.tsx` is the default route for a folder
5. **Path aliases**: Always use `@/` for imports from project root

---

## 🔍 Need Help?

If you encounter issues:
1. Check that all dependencies are installed
2. Verify import paths use `@/` alias
3. Ensure TypeScript can resolve paths (check `tsconfig.json`)
4. Look for circular dependencies
5. Check Expo Router documentation: https://docs.expo.dev/router/introduction/

