import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { AuthUser, UserRole } from '../types';
import { getFirebaseAuth } from '../services/firebase/app';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import { SECURE_KEYS } from '../utils/constants';

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  firebaseReady: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  setRole: (role: UserRole) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    (async () => {
      try {
        const auth = getFirebaseAuth();
        setFirebaseReady(true);
        unsub = onAuthStateChanged(auth, async (firebaseUser) => {
          if (!firebaseUser) {
            setUser(null);
            setLoading(false);
            return;
          }
          const role =
            ((await SecureStore.getItemAsync(SECURE_KEYS.role)) as UserRole | null) ??
            'unassigned';
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role,
          });
          setLoading(false);
        });
      } catch {
        // Firebase credentials not configured yet — allow offline bootstrap.
        setFirebaseReady(false);
        const role =
          ((await SecureStore.getItemAsync(SECURE_KEYS.role)) as UserRole | null) ??
          'unassigned';
        setUser({
          uid: 'local-dev-user',
          email: null,
          displayName: 'Local Dev',
          role,
        });
        setLoading(false);
      }
    })();
    return () => unsub?.();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      const auth = getFirebaseAuth();
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (displayName.trim()) {
        await updateProfile(cred.user, { displayName: displayName.trim() });
      }
    },
    [],
  );

  const signOut = useCallback(async () => {
    try {
      const auth = getFirebaseAuth();
      await firebaseSignOut(auth);
    } catch {
      // ignore when firebase is not configured
    }
    await SecureStore.deleteItemAsync(SECURE_KEYS.role);
    setUser(null);
  }, []);

  const setRole = useCallback(
    async (role: UserRole) => {
      await SecureStore.setItemAsync(SECURE_KEYS.role, role);
      setUser((prev) => (prev ? { ...prev, role } : prev));
    },
    [],
  );

  const value = useMemo(
    () => ({ user, loading, firebaseReady, signIn, signUp, signOut, setRole }),
    [user, loading, firebaseReady, signIn, signUp, signOut, setRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
