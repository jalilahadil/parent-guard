import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { useAuth } from '../store/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { AuthStack } from './AuthStack';
import { ParentStack } from './ParentStack';
import { ChildStack } from './ChildStack';
import { PermissionStack } from './PermissionStack';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { user, loading } = useAuth();
  const { allGranted, loading: permissionsLoading } = usePermissions();

  if (loading || permissionsLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#0B3D2E" />
      </View>
    );
  }

  const needsAuth = !user || user.role === 'unassigned';
  const needsPermissions = !!user && user.role === 'child' && !allGranted;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {needsAuth ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : needsPermissions ? (
          <Stack.Screen name="Permissions" component={PermissionStack} />
        ) : user?.role === 'parent' ? (
          <Stack.Screen name="Parent" component={ParentStack} />
        ) : (
          <Stack.Screen name="Child" component={ChildStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
