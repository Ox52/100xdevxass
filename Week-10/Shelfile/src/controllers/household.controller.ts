import type { Request, Response } from "express";
import { Household, User } from "../models";
import { generateInviteCode } from "../utils/inviteCode";

const DUPLICATE_KEY = 11000;

const findUniqueInviteCode = async (): Promise<string> => {
  for (let attempt = 0; attempt < 5; attempt++) {
    const inviteCode = generateInviteCode();
    const exists = await Household.exists({ inviteCode });

    if (!exists) return inviteCode;
  }

  throw new Error("Could not generate a unique invite code");
};

export const createHousehold = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Household name is required",
      });
    }

    const user = await User.findById(req.user?.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.householdId) {
      return res.status(409).json({
        message: "You already belong to a household",
      });
    }

    const inviteCode = await findUniqueInviteCode();

    const household = await Household.create({
      name,
      inviteCode,
      admin: user._id,
      members: [user._id],
    });

    user.householdId = household._id;
    await user.save();

    return res.status(201).json({
      message: "Household created successfully",
      household,
    });
  } catch (error) {
    console.error(error);

    if ((error as { code?: number }).code === DUPLICATE_KEY) {
      return res.status(409).json({
        message: "Household already exists",
      });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

export const joinHousehold = async (req: Request, res: Response) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({
        message: "Invite code is required",
      });
    }

    const user = await User.findById(req.user?.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.householdId) {
      return res.status(409).json({
        message: "You already belong to a household",
      });
    }

    const household = await Household.findOne({
      inviteCode: String(inviteCode).toUpperCase(),
    });

    if (!household) {
      return res.status(404).json({
        message: "No household found for that invite code",
      });
    }

    await Household.updateOne(
      { _id: household._id },
      { $addToSet: { members: user._id } }
    );

    user.householdId = household._id;
    await user.save();

    const updated = await Household.findById(household._id);

    return res.status(200).json({
      message: "Joined household successfully",
      household: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMyHousehold = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.householdId) {
      return res.status(404).json({
        message: "You do not belong to a household yet",
      });
    }

    const household = await Household.findById(user.householdId)
      .populate("members", "name email")
      .populate("admin", "name email");

    return res.status(200).json({ household });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
