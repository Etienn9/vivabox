// Accepts codes pasted with different casing/spacing/dashes (e.g. "viva-ab3d7",
// "VIVA AB3D7") and normalizes them to the same comparable form.
export function normalizeCode(code: string): string {
  return String(code || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .trim()
}
