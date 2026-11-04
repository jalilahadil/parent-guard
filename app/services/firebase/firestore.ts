import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import type { AppRestriction, FamilyLink } from '../../types';
import { getFirestoreDb } from './app';

export async function upsertFamilyLink(link: FamilyLink): Promise<void> {
  const db = getFirestoreDb();
  await setDoc(doc(db, 'familyLinks', link.id), {
    ...link,
    updatedAt: serverTimestamp(),
  });
}

export async function findFamilyLinkByCode(pairingCode: string): Promise<FamilyLink | null> {
  const db = getFirestoreDb();
  const q = query(collection(db, 'familyLinks'), where('pairingCode', '==', pairingCode));
  const snap = await getDocs(q);
  if (snap.empty) {
    return null;
  }
  return snap.docs[0].data() as FamilyLink;
}

export async function saveRestrictions(
  childUid: string,
  restrictions: AppRestriction[],
): Promise<void> {
  const db = getFirestoreDb();
  await setDoc(
    doc(db, 'restrictions', childUid),
    {
      childUid,
      items: restrictions,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function loadRestrictions(childUid: string): Promise<AppRestriction[]> {
  const db = getFirestoreDb();
  const snap = await getDoc(doc(db, 'restrictions', childUid));
  if (!snap.exists()) {
    return [];
  }
  const data = snap.data();
  return (data.items as AppRestriction[]) ?? [];
}
