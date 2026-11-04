import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ChildStackParamList } from '../types';
import { ChildHomeScreen } from '../screens/child/ChildHomeScreen';
import { EnterPairingCodeScreen } from '../screens/child/EnterPairingCodeScreen';
import { ChildStatusScreen } from '../screens/child/ChildStatusScreen';

const Stack = createNativeStackNavigator<ChildStackParamList>();

export function ChildStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChildHome" component={ChildHomeScreen} options={{ title: 'Child' }} />
      <Stack.Screen
        name="EnterPairingCode"
        component={EnterPairingCodeScreen}
        options={{ title: 'Pairing' }}
      />
      <Stack.Screen
        name="ChildStatus"
        component={ChildStatusScreen}
        options={{ title: 'Status' }}
      />
    </Stack.Navigator>
  );
}
