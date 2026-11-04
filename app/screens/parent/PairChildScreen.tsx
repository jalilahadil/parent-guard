import React, { useState } from 'react';
import { Text, HelperText } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ParentStackParamList } from '../../types';
import { Screen } from '../../components/Screen';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useAuth } from '../../store/AuthContext';
import { createParentPairing } from '../../services/pairing/pairingService';

type Props = NativeStackScreenProps<ParentStackParamList, 'PairChild'>;

export function PairChildScreen(_props: Props) {
  const { user } = useAuth();
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!user) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const link = await createParentPairing(user.uid);
      setCode(link.pairingCode);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create pairing code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen title="Pair child device">
      <Text>
        Generate a short code and enter it on the child device. Codes are stored in Firestore
        when Firebase is configured; otherwise they stay in local memory for this session.
      </Text>
      <PrimaryButton label="Generate code" onPress={generate} loading={loading} />
      {code ? (
        <Text variant="displaySmall" style={{ letterSpacing: 4, textAlign: 'center' }}>
          {code}
        </Text>
      ) : null}
      {error ? <HelperText type="error" visible>{error}</HelperText> : null}
    </Screen>
  );
}
