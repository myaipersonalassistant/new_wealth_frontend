/**
 * Starter Pack access - unlocked when user submits the form on /start
 * Checks email_subscriptions for source 'starter-pack' or starter_pack_claimed
 */

import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const SOURCE_STARTER_PACK = 'starter-pack';

/** Check if user has Starter Pack access (submitted form on /start) */
export async function hasStarterPackAccess(userEmail: string | null | undefined): Promise<boolean> {
  const email = (userEmail || '').trim().toLowerCase();
  if (!email || !email.includes('@')) return false;

  const col = collection(db, 'email_subscriptions');
  // Check source OR starter_pack_claimed (two queries - Firestore has no OR)
  const [bySource, byClaimed] = await Promise.all([
    getDocs(query(col, where('email', '==', email), where('source', '==', SOURCE_STARTER_PACK))),
    getDocs(query(col, where('email', '==', email), where('starter_pack_claimed', '==', true))),
  ]);
  return !bySource.empty || !byClaimed.empty;
}
