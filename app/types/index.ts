export type UserRole = 'parent' | 'child' | 'unassigned';

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
};

export type FamilyLink = {
  id: string;
  parentUid: string;
  childUid: string;
  childDeviceId: string;
  pairingCode: string;
  createdAt: number;
};

export type AppRestriction = {
  id: string;
  packageName: string;
  appLabel: string;
  blocked: boolean;
  dailyLimitMinutes: number | null;
  updatedAt: number;
};

export type UsageRecord = {
  id: string;
  packageName: string;
  appLabel: string;
  startTime: number;
  endTime: number;
  durationMs: number;
};

export type PermissionStatus = {
  accessibility: boolean;
  usageStats: boolean;
  overlay: boolean;
  notifications: boolean;
};

export type RootStackParamList = {
  Auth: undefined;
  Parent: undefined;
  Child: undefined;
  Permissions: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  RoleSelect: undefined;
};

export type ParentStackParamList = {
  ParentHome: undefined;
  PairChild: undefined;
  Restrictions: undefined;
  Usage: undefined;
  Settings: undefined;
};

export type ChildStackParamList = {
  ChildHome: undefined;
  EnterPairingCode: undefined;
  ChildStatus: undefined;
};

export type PermissionStackParamList = {
  PermissionOverview: undefined;
  AccessibilityPermission: undefined;
  UsageStatsPermission: undefined;
  OverlayPermission: undefined;
  PermissionComplete: undefined;
};
