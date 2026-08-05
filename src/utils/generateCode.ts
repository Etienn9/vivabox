import { randomInt } from "node:crypto"

// Excludes visually ambiguous characters (0, O, 1, I)
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

export function generateCode(prefix: string, length = 5): string {
  let suffix = ""

  for (let i = 0; i < length; i++) {
    suffix += ALPHABET[randomInt(ALPHABET.length)]
  }

  return `${prefix}-${suffix}`
}
