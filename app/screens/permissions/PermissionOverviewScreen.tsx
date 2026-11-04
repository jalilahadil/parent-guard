import React from 'react';
import { Text } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PermissionStackParamList } from '../../types';
import { Screen } from '../../components/Screen';
import { PrimaryButton } from '../../components/PrimaryButton';
import { usePermissions } from '../../hooks/usePermissions';

type Props = NativeStackScreenProps<PermissionStackParamList, 'PermissionOverview'>;

export function PermissionOverviewScreen({ navigation }: Props) {
  const { status, allGranted } = usePermissions();

  return (
    <Screen title="Required permissions">
      <Text>
        Method B uses standard Android special-access permissions. ParentGuard never requests
        Device Owner privileges and never factory-resets the child phone.
      </Text>
      <Text>Accessibility: {status.accessibility ? 'OK' : 'needed'}</Text>
      <Text>Usage access: {status.usageStats ? 'OK' : 'needed'}</Text>
      <Text>Display over other apps: {status.overlay ? 'OK' : 'needed'}</Text>
      <PrimaryButton
        label="Set up Accessibility"
        onPress={() => navigation.navigate('AccessibilityPermission')}
      />
      <PrimaryButton
        label="Set up Usage access"
        mode="outlined"
        onPress={() => navigation.navigate('UsageStatsPermission')}
      />
      <PrimaryButton
        label="Set up Overlay"
        mode="outlined"
        onPress={() => navigation.navigate('OverlayPermission')}
      />
      {allGranted ? (
        <PrimaryButton
          label="Finish setup"
          onPress={() => navigation.navigate('PermissionComplete')}
        />
      ) : null}
    </Screen>
  );
}
