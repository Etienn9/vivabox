import { generateCode } from "@/utils/generateCode"

// 8 chars (32^8 ≈ 1.1e12 combinations) — long enough to resist brute-force
// guessing against a rate-limited endpoint, still short enough to type from
// a printed box.
export function generateActivationCode(): string {
  return generateCode("VIVA", 8)
}
