import { generateCode } from "@/utils/generateCode"

// 8 chars, same alphabet as generateActivationCode — consistent length
// across every code Vivabox generates.
export function generateWelcomeCode(): string {
  return generateCode("BIENVENIDA", 8)
}
