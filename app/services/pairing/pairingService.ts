import * as SecureStore from 'expo-secure-store';
import type { FamilyLink } from '../../types';
import { generatePairingCode } from '../../utils/pairingCode';
import { SECURE_KEYS } from '../../utils/constants';
import { findFamilyLinkByCode, upsertFamilyLink } from '../firebase/firestore';
import { isFirebaseConfigured } from '../firebase/app';

const localPairings = new Map<string, FamilyLink>();

export async function createParentPairing(parentUid: string): Promise<FamilyLink> {
  const pairingCode = generatePairingCode();
  const link: FamilyLink = {
    id: `${parentUid}_${Date.now()}`,
    parentUid,
    childUid: '',
    childDeviceId: '',
    pairingCode,
    createdAt: Date.now(),
  };

  if (isFirebaseConfigured) {
    await upsertFamilyLink(link);
  } else {
    localPairings.set(pairingCode, link);
  }

  await SecureStore.setItemAsync(SECURE_KEYS.familyId, link.id);
  return link;
}

export async function redeemPairingCode(
  pairingCode: string,
  childUid: string,
  childDeviceId: string,
): Promise<FamilyLink> {
  let link: FamilyLink | null = null;

  if (isFirebaseConfigured) {
    link = await findFamilyLinkByCode(pairingCode);
  } else {
    link = localPairings.get(pairingCode) ?? null;
  }

  if (!link) {
    throw new Error('Invalid or expired pairing code.');
  }

  const updated: FamilyLink = {
    ...link,
    childUid,
    childDeviceId,
  };

  if (isFirebaseConfigured) {
    await upsertFamilyLink(updated);
  } else {
    localPairings.set(pairingCode, updated);
  }

  await SecureStore.setItemAsync(SECURE_KEYS.familyId, updated.id);
  await SecureStore.setItemAsync(SECURE_KEYS.deviceId, childDeviceId);
  return updated;
}
