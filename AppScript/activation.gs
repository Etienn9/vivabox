// ==============================
// activation.gs – VERSION CORRIGÉE
// ==============================

function activate_code(payload) {
  const lock = LockService.getScriptLock()
  lock.waitLock(5000)

  try {
    // ==============================
    // INPUT VALIDATION & RATE LIMITING
    // ==============================
    if (!payload || !payload.codigo || !payload.nombre || !payload.email) {
      return error("INVALID_INPUT")
    }

    const emailIdentifier = normalizeEmail(payload.email)
    if (!checkRateLimit(emailIdentifier)) {
      return error("TOO_MANY_ATTEMPTS")
    }

    const codigo = normalizeCode(payload.codigo)
    let nombre = String(payload.nombre).trim()
    let email = normalizeEmail(payload.email)

    if (nombre.length > 100) nombre = nombre.substring(0, 100)
    if (email.length > 100) email = email.substring(0, 100)

    if (!isValidEmail(email)) {
      recordRateLimitFailure(emailIdentifier)
      return error("INVALID_EMAIL")
    }

    // ==============================
    // SHEET REFERENCES
    // ==============================
    const codigosSheet = getSheet("Codigos")
    const ventasSheet = getSheet("Ventas")
    const clientesSheet = getSheet("Clientes")
    const beneficiariosSheet = getSheet("Beneficiario")

    // ==============================
    // LOAD CODIGOS DATA
    // ==============================
    const codigosData = codigosSheet.getDataRange().getValues()
    const headers = codigosData[0]

    // Rendre la colonne Email_Beneficiario optionnelle
    let idx
    let hasEmailBeneficiario = true
    try {
      idx = getIndexes(headers, [
        "Codigo",
        "Estado",
        "VentaID",
        "Token",
        "ID_Beneficiario",
        "Fecha_activacion",
        "Expiracion",
        "Email_Beneficiario"
      ])
    } catch (e) {
      // Colonne absente, on utilise les colonnes sans elle
      idx = getIndexes(headers, [
        "Codigo",
        "Estado",
        "VentaID",
        "Token",
        "ID_Beneficiario",
        "Fecha_activacion",
        "Expiracion"
      ])
      hasEmailBeneficiario = false
    }

    // ==============================
    // FIND CODE (normalized comparison)
    // ==============================
    let rowIndex = -1
    let row = null
    const codigoNormalized = codigo // déjà normalisé

    for (let i = 1; i < codigosData.length; i++) {
      const currentRaw = String(codigosData[i][idx.Codigo]).trim()
      const currentNormalized = normalizeCode(currentRaw)
      if (currentNormalized === codigoNormalized) {
        rowIndex = i
        row = codigosData[i]
        break
      }
    }

    if (!row) {
      recordRateLimitFailure(emailIdentifier)
      return error("INVALID")
    }

    const estado = safe(row[idx.Estado])
    const ventaId = safe(row[idx.VentaID])
    const expiracion = row[idx.Expiracion]

    // 🔒 Vérification supplémentaire : un code déjà lié à un bénéficiaire ne peut pas être réactivé
    const existingBeneficiarioId = safe(row[idx.ID_Beneficiario])
    if (existingBeneficiarioId && estado !== "Activada") {
      // Si un bénéficiaire existe mais l'état n'est pas Activada, c'est incohérent → bloquer
      recordRateLimitFailure(emailIdentifier)
      return error("INCONSISTENT_STATE")
    }

    if (estado === "Activada") {
      recordRateLimitFailure(emailIdentifier)
      return error("ALREADY_ACTIVATED")
    }

    if (estado !== "Vendida") {
      recordRateLimitFailure(emailIdentifier)
      return error("NOT_AVAILABLE")
    }

    if (expiracion && new Date(expiracion) < new Date()) {
      recordRateLimitFailure(emailIdentifier)
      return error("EXPIRED")
    }

    if (!ventaId) {
      recordRateLimitFailure(emailIdentifier)
      return error("INCONSISTENT_STATE")
    }

    const venta = findVenta(ventasSheet, ventaId)
    if (!venta) {
      recordRateLimitFailure(emailIdentifier)
      return error("INCONSISTENT_STATE")
    }

    if (safe(venta.estado).toLowerCase() !== "pagado") {
      recordRateLimitFailure(emailIdentifier)
      return error("NOT_AVAILABLE")
    }

    const clienteId = venta.clienteId
    if (!clienteId) {
      recordRateLimitFailure(emailIdentifier)
      return error("INCONSISTENT_STATE")
    }

    const cliente = findCliente(clientesSheet, clienteId)
    if (!cliente) {
      recordRateLimitFailure(emailIdentifier)
      return error("INCONSISTENT_STATE")
    }

    if (safe(cliente.estado).toLowerCase() !== "completado") {
      recordRateLimitFailure(emailIdentifier)
      return error("NOT_AVAILABLE")
    }

    // ==============================
    // CRÉATION DU BÉNÉFICIAIRE
    // ==============================
    const beneficiarioId = generateId()

    const safeNombre = escapeFormula(nombre)
    const safeEmail = escapeFormula(email)

    beneficiariosSheet.appendRow([
      beneficiarioId,
      safeNombre,
      "",
      safeEmail,
      "",
      codigo, // code normalisé sans tirets
      ventaId,
      "",
      new Date()
    ])

    // ==============================
    // MISE À JOUR DE LA LIGNE CODIGOS
    // ==============================
    const rowNumber = rowIndex + 1
    codigosSheet.getRange(rowNumber, idx.Estado + 1).setValue("Activada")
    codigosSheet.getRange(rowNumber, idx.ID_Beneficiario + 1).setValue(beneficiarioId)
    codigosSheet.getRange(rowNumber, idx.Fecha_activacion + 1).setValue(new Date())
    if (hasEmailBeneficiario) {
      codigosSheet.getRange(rowNumber, idx.Email_Beneficiario + 1).setValue(email)
    }

    // ==============================
    // GÉNÉRATION DU TOKEN DE SESSION AVEC LIEN CODE + BÉNÉFICIAIRE
    // ==============================
    const sessionToken = generateToken()
    // Utilisation d'une fonction améliorée qui stocke également le code
    storeSessionTokenWithCode(sessionToken, beneficiarioId, codigo)
    Logger.log("activate_code: success, token stored for " + beneficiarioId + " with code " + codigo)

    return success({ token: sessionToken })

  } catch (err) {
    Logger.log(err)
    return error("SERVER_ERROR")
  } finally {
    lock.releaseLock()
  }
}

// ==============================
// VERIFY ACCESS (renforcée)
// ==============================

function verify_access(payload) {
  try {
    Logger.log("=== verify_access START ===")
    if (!payload || !payload.codigo || !payload.email) {
      return error("INVALID_INPUT")
    }

    const emailIdentifier = normalizeEmail(payload.email)
    if (!checkRateLimit(emailIdentifier)) {
      return error("TOO_MANY_ATTEMPTS")
    }

    const codigo = normalizeCode(payload.codigo)
    const email = normalizeEmail(payload.email)

    const codigosSheet = getSheet("Codigos")
    const codigosData = codigosSheet.getDataRange().getValues()
    const headers = codigosData[0]
    const idx = getIndexes(headers, ["Codigo", "Estado", "ID_Beneficiario"])

    let beneficiarioId = null
    let found = false
    for (let i = 1; i < codigosData.length; i++) {
      const currentRaw = String(codigosData[i][idx.Codigo]).trim()
      const currentNormalized = normalizeCode(currentRaw)
      if (currentNormalized === codigo) {
        found = true
        const estado = safe(codigosData[i][idx.Estado])
        if (estado !== "Activada") {
          recordRateLimitFailure(emailIdentifier)
          return error("NOT_ACTIVATED")
        }
        beneficiarioId = safe(codigosData[i][idx.ID_Beneficiario])
        break
      }
    }
    if (!found) {
      recordRateLimitFailure(emailIdentifier)
      return error("INVALID")
    }
    if (!beneficiarioId) {
      recordRateLimitFailure(emailIdentifier)
      return error("INCONSISTENT_STATE")
    }

    const beneficiariosSheet = getSheet("Beneficiario")
    const benData = beneficiariosSheet.getDataRange().getValues()
    const benHeaders = benData[0]
    const benIdx = getIndexes(benHeaders, ["ID_Beneficiario", "Email"])

    let beneficiaryEmail = null
    for (let i = 1; i < benData.length; i++) {
      if (safe(benData[i][benIdx.ID_Beneficiario]) === beneficiarioId) {
        beneficiaryEmail = normalizeEmail(benData[i][benIdx.Email])
        break
      }
    }
    if (!beneficiaryEmail) {
      recordRateLimitFailure(emailIdentifier)
      return error("INCONSISTENT_STATE")
    }

    if (beneficiaryEmail !== email) {
      recordRateLimitFailure(emailIdentifier)
      return error("EMAIL_MISMATCH")
    }

    // Génération du token avec lien code + bénéficiaire
    const sessionToken = generateToken()
    storeSessionTokenWithCode(sessionToken, beneficiarioId, codigo)
    Logger.log("verify_access: success, token stored for " + beneficiarioId + " with code " + codigo)

    return success({ token: sessionToken })

  } catch (err) {
    Logger.log("verify_access EXCEPTION: " + err.message)
    return error("SERVER_ERROR")
  }
}

// ==============================
// VALIDATE SESSION (inchangée mais doit être complétée dans utils.gs)
// ==============================

function validate_session(payload) {
  try {
    if (!payload || !payload.token) {
      return error("INVALID_INPUT")
    }
    const userId = validateSessionToken(payload.token)
    if (!userId) {
      return error("INVALID_SESSION")
    }
    // Pour une sécurité complète, il faudrait aussi vérifier le code.
    // La fonction validateSessionTokenWithCode peut être ajoutée dans utils.gs.
    return success({ valid: true, userId })
  } catch (err) {
    Logger.log("validate_session EXCEPTION: " + err.message)
    return error("SERVER_ERROR")
  }
}

// ==============================
// NOUVELLE FONCTION : stockage token + code
// ==============================

function storeSessionTokenWithCode(token, userId, codigo) {
  const cache = CacheService.getScriptCache()
  // Stockage standard (utilisé par validateSessionToken)
  if (typeof storeSessionToken === 'function') {
    storeSessionToken(token, userId)
  } else {
    cache.put(`session_${token}`, userId, 604800)
  }
  // Stockage supplémentaire pour lier le code
  cache.put(`session_code_${token}`, codigo, 604800)
}

// ==============================
// HELPERS (inchangés)
// ==============================

function safe(v) {
  return String(v || "").trim()
}

function getIndexes(headers, fields) {
  const map = {}
  fields.forEach(f => {
    const i = headers.indexOf(f)
    if (i === -1) {
      throw new Error("Missing column: " + f)
    }
    map[f] = i
  })
  return map
}

function findVenta(sheet, ventaId) {
  const data = sheet.getDataRange().getValues()
  const headers = data[0]
  const idx = getIndexes(headers, ["VentaID", "Estado", "ID_Cliente"])
  const target = safe(ventaId)
  for (let i = 1; i < data.length; i++) {
    if (safe(data[i][idx.VentaID]) === target) {
      return {
        estado: data[i][idx.Estado],
        clienteId: safe(data[i][idx.ID_Cliente])
      }
    }
  }
  return null
}

function findCliente(sheet, clienteId) {
  const data = sheet.getDataRange().getValues()
  const headers = data[0]
  const idx = getIndexes(headers, ["ID_Cliente", "Estado_checkout"])
  const target = safe(clienteId)
  for (let i = 1; i < data.length; i++) {
    if (safe(data[i][idx.ID_Cliente]) === target) {
      return {
        estado: data[i][idx.Estado_checkout]
      }
    }
  }
  return null
}

function generateToken() {
  return Utilities.getUuid()
}

function success(data) {
  return { success: true, data }
}

function error(code) {
  return { success: false, error: code }
}

function getSheet(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name)
}