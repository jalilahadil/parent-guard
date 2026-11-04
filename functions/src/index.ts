import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';

admin.initializeApp();

/**
 * Trusted pairing redemption — validates parent-owned codes server-side.
 * Deploy after Firebase credentials are available.
 */
export const redeemPairingCode = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required.');
  }

  const pairingCode = String(request.data?.pairingCode ?? '')
    .trim()
    .toUpperCase();
  const childDeviceId = String(request.data?.childDeviceId ?? '');

  if (!pairingCode || !childDeviceId) {
    throw new HttpsError('invalid-argument', 'pairingCode and childDeviceId are required.');
  }

  const db = admin.firestore();
  const snap = await db
    .collection('familyLinks')
    .where('pairingCode', '==', pairingCode)
    .limit(1)
    .get();

  if (snap.empty) {
    throw new HttpsError('not-found', 'Pairing code not found.');
  }

  const docRef = snap.docs[0].ref;
  await docRef.update({
    childUid: request.auth.uid,
    childDeviceId,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { familyLinkId: docRef.id };
});

/**
 * Push restriction changes to the child device via FCM when configured.
 */
export const onRestrictionsUpdated = onDocumentWritten(
  'restrictions/{childUid}',
  async (event) => {
    const childUid = event.params.childUid;
    const after = event.data?.after?.data();
    if (!after) {
      return;
    }

    const tokenSnap = await admin.firestore().collection('deviceTokens').doc(childUid).get();
    const token = tokenSnap.data()?.fcmToken as string | undefined;
    if (!token) {
      return;
    }

    await admin.messaging().send({
      token,
      data: {
        type: 'restrictions_updated',
        childUid,
      },
      notification: {
        title: 'ParentGuard',
        body: 'Your restrictions were updated.',
      },
    });
  },
);
