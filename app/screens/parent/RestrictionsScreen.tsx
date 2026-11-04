import React, { useEffect, useState } from 'react';
import { Switch, Text, HelperText } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppRestriction, ParentStackParamList } from '../../types';
import { Screen } from '../../components/Screen';
import { PrimaryButton } from '../../components/PrimaryButton';
import {
  cacheRestrictions,
  getCachedRestrictions,
} from '../../services/restrictions/localDb';
import { syncBlockedPackagesToNative } from '../../services/restrictions/nativeBridge';

type Props = NativeStackScreenProps<ParentStackParamList, 'Restrictions'>;

const seed: AppRestriction[] = [
  {
    id: 'youtube',
    packageName: 'com.google.android.youtube',
    appLabel: 'YouTube',
    blocked: false,
    dailyLimitMinutes: 60,
    updatedAt: Date.now(),
  },
  {
    id: 'tiktok',
    packageName: 'com.zhiliaoapp.musically',
    appLabel: 'TikTok',
    blocked: true,
    dailyLimitMinutes: null,
    updatedAt: Date.now(),
  },
  {
    id: 'chrome',
    packageName: 'com.android.chrome',
    appLabel: 'Chrome',
    blocked: false,
    dailyLimitMinutes: 90,
    updatedAt: Date.now(),
  },
];

export function RestrictionsScreen(_props: Props) {
  const [items, setItems] = useState<AppRestriction[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const cached = await getCachedRestrictions();
      setItems(cached.length ? cached : seed);
    })();
  }, []);

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, blocked: !item.blocked, updatedAt: Date.now() }
          : item,
      ),
    );
  };

  const save = async () => {
    await cacheRestrictions(items);
    const blocked = items.filter((i) => i.blocked).map((i) => i.packageName);
    await syncBlockedPackagesToNative(blocked);
    setMessage('Restrictions cached locally and synced to the native blocker.');
  };

  return (
    <Screen title="Restrictions">
      <Text>
        Blocked packages are cached in SQLite for offline enforcement on the child device.
      </Text>
      {items.map((item) => (
        <Switch
          key={item.id}
          value={item.blocked}
          onValueChange={() => toggle(item.id)}
        // Paper Switch does not show labels; use adjacent text via wrapper pattern below.
        />
      ))}
      {items.map((item) => (
        <Text key={`label-${item.id}`}>
          {item.appLabel} ({item.packageName}) — {item.blocked ? 'Blocked' : 'Allowed'}
          {'  '}
          <Text
            onPress={() => toggle(item.id)}
            style={{ color: '#0B3D2E', fontWeight: '700' }}
          >
            Toggle
          </Text>
        </Text>
      ))}
      <PrimaryButton label="Save locally" onPress={() => void save()} />
      {message ? <HelperText type="info" visible>{message}</HelperText> : null}
    </Screen>
  );
}
