import React, { useEffect, useState } from 'react';
import { Text, HelperText } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ChildStackParamList } from '../../types';
import { Screen } from '../../components/Screen';
import { PrimaryButton } from '../../components/PrimaryButton';
import { usePermissions } from '../../hooks/usePermissions';
import {
  getForegroundApp,
  startMonitoringService,
  stopMonitoringService,
} from '../../services/restrictions/nativeBridge';
import { getCachedRestrictions } from '../../services/restrictions/localDb';

type Props = NativeStackScreenProps<ChildStackParamList, 'ChildStatus'>;

export function ChildStatusScreen(_props: Props) {
  const { status, refresh, allGranted } = usePermissions();
  const [foreground, setForeground] = useState<string | null>(null);
  const [blockedCount, setBlockedCount] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void refresh();
    void getForegroundApp().then(setForeground);
    void getCachedRestrictions().then((items) =>
      setBlockedCount(items.filter((i) => i.blocked).length),
    );
  }, [refresh]);

  return (
    <Screen title="Protection status">
      <Text>Accessibility: {status.accessibility ? 'granted' : 'missing'}</Text>
      <Text>Usage access: {status.usageStats ? 'granted' : 'missing'}</Text>
      <Text>Overlay: {status.overlay ? 'granted' : 'missing'}</Text>
      <Text>Blocked apps cached: {blockedCount}</Text>
      <Text>Foreground app: {foreground ?? 'unknown'}</Text>
      <PrimaryButton
        label="Start monitoring service"
        disabled={!allGranted}
        onPress={async () => {
          const ok = await startMonitoringService();
          setMessage(ok ? 'Monitoring started.' : 'Could not start monitoring.');
        }}
      />
      <PrimaryButton
        label="Stop monitoring service"
        mode="outlined"
        onPress={async () => {
          const ok = await stopMonitoringService();
          setMessage(ok ? 'Monitoring stopped.' : 'Could not stop monitoring.');
        }}
      />
      {message ? <HelperText type="info" visible>{message}</HelperText> : null}
    </Screen>
  );
}
