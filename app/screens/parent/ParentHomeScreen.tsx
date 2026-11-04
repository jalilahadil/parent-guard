import React from 'react';
import { Text } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ParentStackParamList } from '../../types';
import { Screen } from '../../components/Screen';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useAuth } from '../../store/AuthContext';

type Props = NativeStackScreenProps<ParentStackParamList, 'ParentHome'>;

export function ParentHomeScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();

  return (
    <Screen title="Parent dashboard">
      <Text variant="bodyLarge">Signed in as {user?.displayName ?? user?.email ?? user?.uid}</Text>
      <PrimaryButton label="Pair a child device" onPress={() => navigation.navigate('PairChild')} />
      <PrimaryButton
        label="Manage restrictions"
        mode="outlined"
        onPress={() => navigation.navigate('Restrictions')}
      />
      <PrimaryButton
        label="View usage"
        mode="outlined"
        onPress={() => navigation.navigate('Usage')}
      />
      <PrimaryButton label="Settings" mode="text" onPress={() => navigation.navigate('Settings')} />
      <PrimaryButton label="Sign out" mode="text" onPress={() => void signOut()} />
    </Screen>
  );
}
