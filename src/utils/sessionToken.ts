import { randomBytes, createHash } from "node:crypto"

// The raw token is only ever returned once, to the caller — only its hash
// is persisted, so reading activation_sessions alone can never impersonate
// a session.
export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url")
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}
