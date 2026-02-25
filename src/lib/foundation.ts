/**
 * Foundation Edition - Firestore frontend helpers
 * Orders are created in Firestore; Stripe checkout and emails go through the backend.
 */

import { collection, addDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const FOUNDATION_PRICE = 50;
const ORDERS_COLLECTION = 'foundation_orders';
const STATS_DOC_PATH = 'foundation_stats/main';

export interface FoundationOrderData {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postcode: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  status: 'pending';
}

export async function createFoundationOrder(data: FoundationOrderData): Promise<string> {
  const ordersRef = collection(db, ORDERS_COLLECTION);
  const docRef = await addDoc(ordersRef, {
    ...data,
    created_at: new Date(),
    updated_at: new Date(),
  });
  return docRef.id;
}

export interface FoundationStats {
  copiesSold: number;
  totalRaised: number;
  lastUpdated?: { seconds: number; nanoseconds: number };
}

const BUILDING_FUND_GOAL_GBP = 50000;

export function getBuildingFundGoal(): number {
  return BUILDING_FUND_GOAL_GBP;
}

/**
 * Subscribe to live foundation stats (copies sold, total raised)
 */
export function subscribeToFoundationStats(
  onUpdate: (stats: FoundationStats) => void,
  onError?: (err: Error) => void
): () => void {
  const statsRef = doc(db, STATS_DOC_PATH);
  return onSnapshot(
    statsRef,
    (snap) => {
      const data = snap.data();
      onUpdate({
        copiesSold: data?.copiesSold ?? 0,
        totalRaised: data?.totalRaised ?? 0,
        lastUpdated: data?.lastUpdated,
      });
    },
    (err) => {
      onError?.(err);
      onUpdate({ copiesSold: 0, totalRaised: 0 });
    }
  );
}
