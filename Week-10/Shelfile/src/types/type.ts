export type ItemCategory =
  | "produce"
  | "dairy"
  | "meat"
  | "pantry"
  | "frozen"
  | "other";

export type ItemStatus =
  | "fresh"
  | "expiring-soon"
  | "expired"
  | "used"
  | "wasted";

export interface User{
  name: string;
  email: string;
  householdId: string | null;
  createdAt: Date;

}

export interface Household {
  name: string;
  inviteCode: string;
  members: string[];
  wasteScore: number;
  admin: string;
  createdAt: Date;

}

export interface Item{
  householdId: string;
  addedBy: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  expiryDate: Date;
  status: ItemStatus;
  createdAt: Date;
  updatedAt:Date
}

export interface JwtPayload {
  userId: string;
}
