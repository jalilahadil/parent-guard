import React, { useState } from 'react';
import { Text } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../types';
import { Screen } from '../../components/Screen';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useAuth } from '../../store/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'RoleSelect'>;

export function RoleSelectScreen(_props: Props) {
  const { setRole } = useAuth();
  const [loading, setLoading] = useState(false);

  const choose = async (role: 'parent' | 'child') => {
    setLoading(true);
    try {
      await setRole(role);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen title="Choose role">
      <Text variant="bodyLarge">
        Select how this device will be used. You can change this later from settings once
        Firebase profiles are enabled.
      </Text>
      <PrimaryButton
        label="I am a parent"
        loading={loading}
        onPress={() => choose('parent')}
      />
      <PrimaryButton
        label="This is a child device"
        mode="outlined"
        loading={loading}
        onPress={() => choose('child')}
      />
    </Screen>
  );
}
