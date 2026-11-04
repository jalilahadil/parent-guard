import React from 'react';
import { Text } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PermissionStackParamList } from '../../types';
import { Screen } from '../../components/Screen';
import { PrimaryButton } from '../../components/PrimaryButton';
import { startMonitoringService } from '../../services/restrictions/nativeBridge';

type Props = NativeStackScreenProps<PermissionStackParamList, 'PermissionComplete'>;

export function PermissionCompleteScreen(_props: Props) {
  return (
    <Screen title="Setup complete">
      <Text>
        Special-access permissions are enabled. Start the foreground monitoring service to begin
        enforcing cached restrictions.
      </Text>
      <PrimaryButton
        label="Start monitoring"
        onPress={() => {
          void startMonitoringService();
        }}
      />
    </Screen>
  );
}
