/**
 * FCM client helpers.
 * Full device token registration requires @react-native-firebase/messaging
 * or Expo Notifications + native google-services once credentials are supplied.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  // Placeholder until Firebase Android credentials and messaging native module are wired.
  return null;
}

export async function getStoredFcmToken(): Promise<string | null> {
  return null;
}
