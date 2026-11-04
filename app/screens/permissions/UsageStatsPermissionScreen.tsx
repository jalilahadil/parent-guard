import React from 'react';
import { Text, HelperText } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PermissionStackParamList } from '../../types';
import { Screen } from '../../components/Screen';
import { PrimaryButton } from '../../components/PrimaryButton';
import { openUsageAccessSettings } from '../../services/restrictions/nativeBridge';
import { usePermissions } from '../../hooks/usePermissions';

type Props = NativeStackScreenProps<PermissionStackParamList, 'UsageStatsPermission'>;

export function UsageStatsPermissionScreen({ navigation }: Props) {
  const { status, refresh } = usePermissions();

  return (
    <Screen title="Usage access">
      <Text>
        UsageStatsManager provides accurate app usage timelines. This permission cannot be granted
        through a normal runtime dialog; Android opens the Usage Access settings screen.
      </Text>
      <PrimaryButton
        label="Open Usage Access settings"
        onPress={async () => {
          await openUsageAccessSettings();
          await refresh();
        }}
      />
      <HelperText type="info" visible>
        Status: {status.usageStats ? 'enabled' : 'not enabled'}
      </HelperText>
      <PrimaryButton label="Back" mode="text" onPress={() => navigation.goBack()} />
    </Screen>
  );
}
