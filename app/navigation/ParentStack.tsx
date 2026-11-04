import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ParentStackParamList } from '../types';
import { ParentHomeScreen } from '../screens/parent/ParentHomeScreen';
import { PairChildScreen } from '../screens/parent/PairChildScreen';
import { RestrictionsScreen } from '../screens/parent/RestrictionsScreen';
import { UsageScreen } from '../screens/parent/UsageScreen';
import { SettingsScreen } from '../screens/parent/SettingsScreen';

const Stack = createNativeStackNavigator<ParentStackParamList>();

export function ParentStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ParentHome" component={ParentHomeScreen} options={{ title: 'Parent' }} />
      <Stack.Screen name="PairChild" component={PairChildScreen} options={{ title: 'Pair child' }} />
      <Stack.Screen
        name="Restrictions"
        component={RestrictionsScreen}
        options={{ title: 'Restrictions' }}
      />
      <Stack.Screen name="Usage" component={UsageScreen} options={{ title: 'Usage' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Stack.Navigator>
  );
}
