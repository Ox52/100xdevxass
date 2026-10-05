import { Household, Item } from "../models";
import type { ItemStatus } from "../types/type";

const EXPIRING_SOON_MS = 3 * 24 * 60 * 60 * 1000;

export const deriveStatus = (expiryDate?: Date | null): ItemStatus => {
  if (!expiryDate) return "fresh";

  const now = Date.now();
  const expiry = expiryDate.getTime();

  if (expiry < now) return "expired";
  if (expiry <= now + EXPIRING_SOON_MS) return "expiring-soon";

  return "fresh";
};

export const recalculateWasteScore = async (
  householdId: string
): Promise<number> => {
  const [total, wasted] = await Promise.all([
    Item.countDocuments({ householdId }),
    Item.countDocuments({ householdId, status: "wasted" }),
  ]);

  if (total === 0) return 0;

  const score = Math.round((wasted / total) * 100);

  await Household.updateOne({ _id: householdId }, { wasteScore: score });

  return score;
};
