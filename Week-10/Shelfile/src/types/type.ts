export interface User{


  name: string;
  email: string;
  password: string;
  householdId: string;
  createdAt: Date;

}

export interface Household {
  name: string;
  inviteaCode: string;
  memebers: string[];
  wasteScore: string;
  admin: string;
  createdAt: Date;

}

export interface Item{


  householdId: string;
  addedBy: string;
  name: string;
  category: |"produce" | "dairy" | "meat" | "pantry" | "frozen" | "other";
  quantity: number;
  expiryDate: Date;
  status: | "fresh" | "expiring-soon" | "expired" | "used" | "wasted";
  createdAt: Date;
  updatedAt:Date
}
