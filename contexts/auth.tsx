import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

// Web Client ID — used for Android and token verification
const GOOGLE_WEB_CLIENT_ID = '149436588546-s69hu777jcj5tpttvhcl0vct6ou0vdap.apps.googleusercontent.com';
// iOS Client ID — from Google Cloud Console → iOS OAuth client
const GOOGLE_IOS_CLIENT_ID = '149436588546-o1e3gokl61q91kon989fucjmm2uj1ccf.apps.googleusercontent.com';

export type User = {
  id: string;
  name: string | null;
  email: string | null;
  picture: string | null;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      iosClientId: GOOGLE_IOS_CLIENT_ID,
    });
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const data = userInfo.data?.user;
      if (data) {
        setUser({
          id: data.id,
          name: data.name ?? null,
          email: data.email,
          picture: data.photo ?? null,
        });
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled, do nothing
      } else {
        console.error('Google sign-in error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
