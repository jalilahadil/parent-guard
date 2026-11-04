import React from 'react';
import { Button } from 'react-native-paper';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  mode?: 'contained' | 'outlined' | 'text';
};

export function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
  mode = 'contained',
}: Props) {
  return (
    <Button
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
      style={{ borderRadius: 10 }}
      contentStyle={{ paddingVertical: 6 }}
    >
      {label}
    </Button>
  );
}
