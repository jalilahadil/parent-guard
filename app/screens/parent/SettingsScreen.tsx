import React from 'react';
import { Text } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ParentStackParamList } from '../../types';
import { Screen } from '../../components/Screen';
import { useAuth } from '../../store/AuthContext';
import { isFirebaseConfigured } from '../../services/firebase/app';
import { isNativeModuleAvailable } from '../../services/restrictions/nativeBridge';

type Props = NativeStackScreenProps<ParentStackParamList, 'Settings'>;

export function SettingsScreen(_props: Props) {
  const { user, firebaseReady } = useAuth();

  return (
    <Screen title="Settings">
      <Text>User: {user?.uid}</Text>
      <Text>Role: {user?.role}</Text>
      <Text>Firebase configured: {isFirebaseConfigured && firebaseReady ? 'yes' : 'no'}</Text>
      <Text>Native module linked: {isNativeModuleAvailable() ? 'yes' : 'no'}</Text>
    </Screen>
  );
}
