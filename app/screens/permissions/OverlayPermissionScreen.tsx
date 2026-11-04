import React from 'react';
import { Text, HelperText } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PermissionStackParamList } from '../../types';
import { Screen } from '../../components/Screen';
import { PrimaryButton } from '../../components/PrimaryButton';
import { openOverlaySettings } from '../../services/restrictions/nativeBridge';
import { usePermissions } from '../../hooks/usePermissions';

type Props = NativeStackScreenProps<PermissionStackParamList, 'OverlayPermission'>;

export function OverlayPermissionScreen({ navigation }: Props) {
  const { status, refresh } = usePermissions();

  return (
    <Screen title="Display over other apps">
      <Text>
        SYSTEM_ALERT_WINDOW lets ParentGuard show a native blocking overlay above other apps.
        A React Native Modal cannot do this.
      </Text>
      <PrimaryButton
        label="Open overlay settings"
        onPress={async () => {
          await openOverlaySettings();
          await refresh();
        }}
      />
      <HelperText type="info" visible>
        Status: {status.overlay ? 'enabled' : 'not enabled'}
      </HelperText>
      <PrimaryButton label="Back" mode="text" onPress={() => navigation.goBack()} />
    </Screen>
  );
}
