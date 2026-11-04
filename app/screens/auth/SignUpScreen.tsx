import React, { useState } from 'react';
import { TextInput, HelperText } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../types';
import { Screen } from '../../components/Screen';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useAuth } from '../../store/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const { signUp, firebaseReady, setRole } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!firebaseReady) {
        await setRole('unassigned');
        navigation.navigate('RoleSelect');
        return;
      }
      await signUp(email, password, displayName);
      navigation.navigate('RoleSelect');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen title="Create account">
      {!firebaseReady ? (
        <HelperText type="info" visible>
          Firebase credentials are not configured yet. Continuing in local setup mode.
        </HelperText>
      ) : null}
      <TextInput label="Display name" value={displayName} onChangeText={setDisplayName} />
      <TextInput label="Email" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput
        label="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <HelperText type="error" visible>{error}</HelperText> : null}
      <PrimaryButton label="Create account" onPress={onSubmit} loading={loading} />
    </Screen>
  );
}
