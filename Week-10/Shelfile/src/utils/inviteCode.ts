import crypto from "node:crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const generateInviteCode = (length = 6): string => {
  const chars: string[] = [];

  for (let i = 0; i < length; i++) {
    chars.push(ALPHABET.charAt(crypto.randomInt(ALPHABET.length)));
  }

  return chars.join("");
};
