import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { PermissionStackParamList } from '../types';
import { PermissionOverviewScreen } from '../screens/permissions/PermissionOverviewScreen';
import { AccessibilityPermissionScreen } from '../screens/permissions/AccessibilityPermissionScreen';
import { UsageStatsPermissionScreen } from '../screens/permissions/UsageStatsPermissionScreen';
import { OverlayPermissionScreen } from '../screens/permissions/OverlayPermissionScreen';
import { PermissionCompleteScreen } from '../screens/permissions/PermissionCompleteScreen';

const Stack = createNativeStackNavigator<PermissionStackParamList>();

export function PermissionStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PermissionOverview"
        component={PermissionOverviewScreen}
        options={{ title: 'Permissions' }}
      />
      <Stack.Screen
        name="AccessibilityPermission"
        component={AccessibilityPermissionScreen}
        options={{ title: 'Accessibility' }}
      />
      <Stack.Screen
        name="UsageStatsPermission"
        component={UsageStatsPermissionScreen}
        options={{ title: 'Usage access' }}
      />
      <Stack.Screen
        name="OverlayPermission"
        component={OverlayPermissionScreen}
        options={{ title: 'Overlay' }}
      />
      <Stack.Screen
        name="PermissionComplete"
        component={PermissionCompleteScreen}
        options={{ title: 'Done' }}
      />
    </Stack.Navigator>
  );
}
