import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  title?: string;
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
};

export function Screen({ title, children, scroll = true, style }: Props) {
  const body = scroll ? (
    <ScrollView contentContainerStyle={[styles.content, style]}>{children}</ScrollView>
  ) : (
    <View style={[styles.content, styles.flex, style]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {title ? <Text variant="headlineSmall" style={styles.title}>{title}</Text> : null}
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F4F7F5',
  },
  title: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    color: '#0B3D2E',
    fontWeight: '700',
  },
  content: {
    padding: 20,
    gap: 12,
  },
  flex: {
    flex: 1,
  },
});
