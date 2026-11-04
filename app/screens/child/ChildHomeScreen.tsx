import React from 'react';
import { Text } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ChildStackParamList } from '../../types';
import { Screen } from '../../components/Screen';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useAuth } from '../../store/AuthContext';
import { isNativeModuleAvailable } from '../../services/restrictions/nativeBridge';

type Props = NativeStackScreenProps<ChildStackParamList, 'ChildHome'>;

export function ChildHomeScreen({ navigation }: Props) {
  const { signOut } = useAuth();

  return (
    <Screen title="Child device">
      <Text>
        This device enforces parent restrictions using native Android services. React Native
        Modals cannot cover other apps — blocking uses WindowManager overlays.
      </Text>
      <Text>Native module: {isNativeModuleAvailable() ? 'ready' : 'not linked (rebuild required)'}</Text>
      <PrimaryButton
        label="Enter pairing code"
        onPress={() => navigation.navigate('EnterPairingCode')}
      />
      <PrimaryButton
        label="Protection status"
        mode="outlined"
        onPress={() => navigation.navigate('ChildStatus')}
      />
      <PrimaryButton label="Sign out" mode="text" onPress={() => void signOut()} />
    </Screen>
  );
}
