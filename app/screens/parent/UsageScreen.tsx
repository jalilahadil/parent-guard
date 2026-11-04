import React, { useEffect, useState } from 'react';
import { Text } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ParentStackParamList, UsageRecord } from '../../types';
import { Screen } from '../../components/Screen';
import { listUsageRecords } from '../../services/restrictions/localDb';

type Props = NativeStackScreenProps<ParentStackParamList, 'Usage'>;

export function UsageScreen(_props: Props) {
  const [records, setRecords] = useState<UsageRecord[]>([]);

  useEffect(() => {
    void listUsageRecords().then(setRecords);
  }, []);

  return (
    <Screen title="Usage">
      <Text>
        Usage records are written by the native UsageStats integration and stored in SQLite.
      </Text>
      {records.length === 0 ? (
        <Text>No local usage records yet.</Text>
      ) : (
        records.map((record) => (
          <Text key={record.id}>
            {record.appLabel}: {Math.round(record.durationMs / 60000)} min
          </Text>
        ))
      )}
    </Screen>
  );
}
