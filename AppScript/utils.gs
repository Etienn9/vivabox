// =============================
// TIME
// =============================

function now() {
  return Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "yyyy-MM-dd HH:mm:ss"
  )
}

function futureMinutes(min) {
  return Utilities.formatDate(
    new Date(Date.now() + min * 60 * 1000),
    Session.getScriptTimeZone(),
    "yyyy-MM-dd HH:mm:ss"
  )
}

// =============================
// RESPONSE
// =============================

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
}

function failResponse(error, detail = "") {
  // Ne pas inclure 'detail' dans la réponse client pour éviter les fuites
  return jsonResponse({ ok: false, error })
}

// =============================
// HELPERS
// =============================

function findColumn(headers, name) {
  const target = String(name).toLowerCase().trim()
  return headers.findIndex(h => String(h).toLowerCase().trim() === target)
}

function getSheet(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name)
}

// =============================
// NORMALIZATION
// =============================

function normalizeCode(code) {
  return String(code || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .trim()
}

function normalizeEmail(email) {
  return String(email || "")
    .toLowerCase()
    .trim()
}

// =============================
// VALIDATION
// =============================

function isEmpty(value) {
  return value === null || value === undefined || String(value).trim() === ""
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// =============================
// RATE LIMITING (5 échecs / 15 min)
// =============================

function getRateLimitKey(identifier) {
  return `ratelimit_${identifier}`
}

function checkRateLimit(identifier) {
  const cache = CacheService.getScriptCache()
  const key = getRateLimitKey(identifier)
  const failures = cache.get(key)
  if (!failures) return true
  const count = parseInt(failures, 10)
  return count < 5
}

function recordRateLimitFailure(identifier) {
  const cache = CacheService.getScriptCache()
  const key = getRateLimitKey(identifier)
  const failures = cache.get(key)
  let count = failures ? parseInt(failures, 10) : 0
  count++
  // Expire après 15 minutes (900 secondes)
  cache.put(key, count.toString(), 900)
  return count
}

// =============================
// SESSION TOKEN MANAGEMENT (expiration 7 jours)
// =============================

function storeSessionToken(token, userId) {
  const cache = CacheService.getScriptCache()
  const key = `session_${token}`
  // Expiration en secondes : 7 jours = 604800 secondes
  cache.put(key, userId, 604800)
}

function validateSessionToken(token) {
  if (!token) return null
  const cache = CacheService.getScriptCache()
  const key = `session_${token}`
  const userId = cache.get(key)
  return userId || null
}

function invalidateSessionToken(token) {
  const cache = CacheService.getScriptCache()
  const key = `session_${token}`
  cache.remove(key)
}

// =============================
// ID GENERATION (SECURE)
// =============================

function generateId(prefix = "") {
  const uuid = Utilities.getUuid()
  const cleanUuid = uuid.replace(/-/g, '')
  if (prefix && prefix !== "") {
    return `${prefix}_${cleanUuid}`
  }
  return cleanUuid
}

function generateBookingId() {
  return "BK_" + Utilities.getUuid().replace(/-/g, '')
}
// =============================
// ESCAPE FORMULA
// =============================

function escapeFormula(value) {
  if (typeof value !== "string") return value
  if (/^[=+\-@\t]/.test(value)) {
    return "'" + value
  }
  return value
}