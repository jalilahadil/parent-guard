import { NativeModules, Platform } from 'react-native';
import type { PermissionStatus } from '../../types';

type ParentGuardNativeModule = {
  getPermissionStatus(): Promise<PermissionStatus>;
  openAccessibilitySettings(): Promise<void>;
  openUsageAccessSettings(): Promise<void>;
  openOverlaySettings(): Promise<void>;
  startMonitoringService(): Promise<boolean>;
  stopMonitoringService(): Promise<boolean>;
  syncBlockedPackages(packages: string[]): Promise<void>;
  getForegroundApp(): Promise<string | null>;
};

const LINKING_ERROR =
  'ParentGuardNative module is unavailable. Build a custom development client (not Expo Go).';

function getNative(): ParentGuardNativeModule | null {
  if (Platform.OS !== 'android') {
    return null;
  }
  return (NativeModules.ParentGuardNative as ParentGuardNativeModule | undefined) ?? null;
}

export async function getNativePermissionStatus(): Promise<PermissionStatus> {
  const native = getNative();
  if (!native) {
    return {
      accessibility: false,
      usageStats: false,
      overlay: false,
      notifications: false,
    };
  }
  return native.getPermissionStatus();
}

export async function openAccessibilitySettings(): Promise<void> {
  const native = getNative();
  if (!native) {
    throw new Error(LINKING_ERROR);
  }
  await native.openAccessibilitySettings();
}

export async function openUsageAccessSettings(): Promise<void> {
  const native = getNative();
  if (!native) {
    throw new Error(LINKING_ERROR);
  }
  await native.openUsageAccessSettings();
}

export async function openOverlaySettings(): Promise<void> {
  const native = getNative();
  if (!native) {
    throw new Error(LINKING_ERROR);
  }
  await native.openOverlaySettings();
}

export async function startMonitoringService(): Promise<boolean> {
  const native = getNative();
  if (!native) {
    return false;
  }
  return native.startMonitoringService();
}

export async function stopMonitoringService(): Promise<boolean> {
  const native = getNative();
  if (!native) {
    return false;
  }
  return native.stopMonitoringService();
}

export async function syncBlockedPackagesToNative(packages: string[]): Promise<void> {
  const native = getNative();
  if (!native) {
    return;
  }
  await native.syncBlockedPackages(packages);
}

export async function getForegroundApp(): Promise<string | null> {
  const native = getNative();
  if (!native) {
    return null;
  }
  return native.getForegroundApp();
}

export function isNativeModuleAvailable(): boolean {
  return getNative() != null;
}
