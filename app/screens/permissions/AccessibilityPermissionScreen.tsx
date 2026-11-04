import React from 'react';
import { Text, HelperText } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PermissionStackParamList } from '../../types';
import { Screen } from '../../components/Screen';
import { PrimaryButton } from '../../components/PrimaryButton';
import { openAccessibilitySettings } from '../../services/restrictions/nativeBridge';
import { usePermissions } from '../../hooks/usePermissions';

type Props = NativeStackScreenProps<PermissionStackParamList, 'AccessibilityPermission'>;

export function AccessibilityPermissionScreen({ navigation }: Props) {
  const { status, refresh } = usePermissions();

  return (
    <Screen title="Accessibility">
      <Text>
        The AccessibilityService detects which app is in the foreground so blocked packages can
        be interrupted. Android requires the user to enable this manually in system settings.
      </Text>
      <PrimaryButton
        label="Open Accessibility settings"
        onPress={async () => {
          await openAccessibilitySettings();
          await refresh();
        }}
      />
      <HelperText type="info" visible>
        Status: {status.accessibility ? 'enabled' : 'not enabled'}
      </HelperText>
      <PrimaryButton label="Back" mode="text" onPress={() => navigation.goBack()} />
    </Screen>
  );
}
