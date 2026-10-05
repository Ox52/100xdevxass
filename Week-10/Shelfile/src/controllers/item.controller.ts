import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Item, User } from "../models";
import { deriveStatus, recalculateWasteScore } from "../utils/wasteScore";
import type { ItemCategory, ItemStatus } from "../types/type";

const CATEGORIES: ItemCategory[] = [
  "produce",
  "dairy",
  "meat",
  "pantry",
  "frozen",
  "other",
];

const STATUSES: ItemStatus[] = [
  "fresh",
  "expiring-soon",
  "expired",
  "used",
  "wasted",
];

const resolveHousehold = async (req: Request) => {
  const user = await User.findById(req.user?.userId).select("householdId");

  if (!user?.householdId) return null;

  return user.householdId;
};

export const createItem = async (req: Request, res: Response) => {
  try {
    const householdId = await resolveHousehold(req);

    if (!householdId) {
      return res.status(400).json({
        message: "Create or join a household first",
      });
    }

    const { name, category, quantity, expiryDate, status } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        message: "Name and category are required",
      });
    }

    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({
        message: `Category must be one of: ${CATEGORIES.join(", ")}`,
      });
    }

    if (status && !STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${STATUSES.join(", ")}`,
      });
    }

    const parsedExpiry = expiryDate ? new Date(expiryDate) : undefined;

    if (parsedExpiry && Number.isNaN(parsedExpiry.getTime())) {
      return res.status(400).json({ message: "Invalid expiryDate" });
    }

    const item = await Item.create({
      householdId,
      addedBy: req.user?.userId,
      name,
      category,
      quantity: quantity ?? 1,
      expiryDate: parsedExpiry,
      status: status ?? deriveStatus(parsedExpiry),
    });

    const wasteScore = await recalculateWasteScore(String(householdId));

    return res.status(201).json({ item, wasteScore });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const listItems = async (req: Request, res: Response) => {
  try {
    const householdId = await resolveHousehold(req);

    if (!householdId) {
      return res.status(400).json({
        message: "Create or join a household first",
      });
    }

    const { status, category } = req.query;
    const filter: Record<string, unknown> = { householdId };

    if (typeof status === "string" && STATUSES.includes(status as ItemStatus)) {
      filter.status = status;
    }

    if (
      typeof category === "string" &&
      CATEGORIES.includes(category as ItemCategory)
    ) {
      filter.category = category;
    }

    const items = await Item.find(filter).sort({ expiryDate: 1 });

    return res.status(200).json({ count: items.length, items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getItem = async (req: Request, res: Response) => {
  try {
    const householdId = await resolveHousehold(req);

    if (!householdId) {
      return res.status(400).json({
        message: "Create or join a household first",
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    const item = await Item.findOne({
      _id: req.params.id,
      householdId,
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ item });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const householdId = await resolveHousehold(req);

    if (!householdId) {
      return res.status(400).json({
        message: "Create or join a household first",
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    const { name, category, quantity, expiryDate, status } = req.body;

    if (category && !CATEGORIES.includes(category)) {
      return res.status(400).json({
        message: `Category must be one of: ${CATEGORIES.join(", ")}`,
      });
    }

    if (status && !STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${STATUSES.join(", ")}`,
      });
    }

    let parsedExpiry: Date | undefined;

    if (expiryDate) {
      parsedExpiry = new Date(expiryDate);

      if (Number.isNaN(parsedExpiry.getTime())) {
        return res.status(400).json({ message: "Invalid expiryDate" });
      }
    }

    if (quantity !== undefined && quantity < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }

    const updates: Record<string, unknown> = {};

    if (name !== undefined) updates.name = name;
    if (category !== undefined) updates.category = category;
    if (quantity !== undefined) updates.quantity = quantity;
    if (parsedExpiry) updates.expiryDate = parsedExpiry;
    if (status !== undefined) updates.status = status;

    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, householdId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const wasteScore = await recalculateWasteScore(String(householdId));

    return res.status(200).json({ item, wasteScore });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const householdId = await resolveHousehold(req);

    if (!householdId) {
      return res.status(400).json({
        message: "Create or join a household first",
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    const item = await Item.findOneAndDelete({
      _id: req.params.id,
      householdId,
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const wasteScore = await recalculateWasteScore(String(householdId));

    return res.status(200).json({ message: "Item deleted", wasteScore });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
