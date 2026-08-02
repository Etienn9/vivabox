import { randomInt } from "node:crypto"

// Excludes visually ambiguous characters (0, O, 1, I)
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
const SUFFIX_LENGTH = 5

export function generateWelcomeCode(): string {
  let suffix = ""

  for (let i = 0; i < SUFFIX_LENGTH; i++) {
    suffix += ALPHABET[randomInt(ALPHABET.length)]
  }

  return `BIENVENIDA-${suffix}`
}
