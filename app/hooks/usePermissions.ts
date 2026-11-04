import { useCallback, useEffect, useState } from 'react';
import type { PermissionStatus } from '../types';
import { getNativePermissionStatus } from '../services/restrictions/nativeBridge';

const empty: PermissionStatus = {
  accessibility: false,
  usageStats: false,
  overlay: false,
  notifications: false,
};

export function usePermissions() {
  const [status, setStatus] = useState<PermissionStatus>(empty);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = await getNativePermissionStatus();
      setStatus(next);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const allGranted =
    status.accessibility && status.usageStats && status.overlay;

  return { status, loading, refresh, allGranted };
}
