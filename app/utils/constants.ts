export const APP_NAME = 'ParentGuard';
export const PACKAGE_NAME = 'com.parentguard.app';
export const PAIRING_CODE_LENGTH = 6;
export const LOCAL_DB_NAME = 'parentguard.db';
export const SECURE_KEYS = {
  authToken: 'pg_auth_token',
  role: 'pg_role',
  deviceId: 'pg_device_id',
  familyId: 'pg_family_id',
} as const;
