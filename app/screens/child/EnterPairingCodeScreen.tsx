import React, { useState } from 'react';
import { TextInput, HelperText } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ChildStackParamList } from '../../types';
import { Screen } from '../../components/Screen';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useAuth } from '../../store/AuthContext';
import { redeemPairingCode } from '../../services/pairing/pairingService';
import { normalizePairingCode } from '../../utils/pairingCode';
import { SECURE_KEYS } from '../../utils/constants';

type Props = NativeStackScreenProps<ChildStackParamList, 'EnterPairingCode'>;

export function EnterPairingCodeScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!user) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const deviceId =
        (await SecureStore.getItemAsync(SECURE_KEYS.deviceId)) ??
        `device_${Date.now()}`;
      await SecureStore.setItemAsync(SECURE_KEYS.deviceId, deviceId);
      await redeemPairingCode(normalizePairingCode(code), user.uid, deviceId);
      navigation.navigate('ChildStatus');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Pairing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen title="Enter pairing code">
      <TextInput
        label="6-character code"
        autoCapitalize="characters"
        value={code}
        onChangeText={setCode}
      />
      {error ? <HelperText type="error" visible>{error}</HelperText> : null}
      <PrimaryButton label="Pair device" onPress={submit} loading={loading} />
    </Screen>
  );
}
