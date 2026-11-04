import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../types';
import { Screen } from '../../components/Screen';
import { PrimaryButton } from '../../components/PrimaryButton';
import { APP_NAME } from '../../utils/constants';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <Screen title={APP_NAME}>
      <Text variant="titleMedium" style={styles.subtitle}>
        Family device guidance with offline-capable restrictions.
      </Text>
      <Text variant="bodyMedium">
        Parents set limits. Child devices enforce them with native Android
        Accessibility, UsageStats, and overlay services.
      </Text>
      <PrimaryButton label="Sign in" onPress={() => navigation.navigate('SignIn')} />
      <PrimaryButton
        label="Create account"
        mode="outlined"
        onPress={() => navigation.navigate('SignUp')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    color: '#1F4D3D',
    marginBottom: 8,
  },
});
