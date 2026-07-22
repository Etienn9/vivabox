// =============================
// services.gs – VERSION CORRIGÉE
// =============================

// Garantir que CODIGO_ESTADOS existe (fallback si config.gs n'est pas chargé)
if (typeof CODIGO_ESTADOS === 'undefined') {
  var CODIGO_ESTADOS = {
    STOCK: "Stock",
    BLOQUEADA: "Bloqueada",
    VENDIDA: "Vendida",
    ACTIVADA: "Activada",
    RESERVADA: "Reservada",
    CONFIRMADA: "Confirmada",
    UTILIZADA: "Utilizada",
    CANCELADA: "Cancelada",
    PROBLEMA: "Problema"
  }
}

// Garantir que generateBookingId existe (si utils.gs ne l'a pas encore)
if (typeof generateBookingId === 'undefined') {
  var generateBookingId = function() {
    return "BK_" + Utilities.getUuid().replace(/-/g, '')
  }
}

// =============================
// CLIENTES
// =============================

function cliente_upsert(buyer, etapa = "elegir") {
  // =============================
  // VALIDATION (phone PLUS obligatoire)
  // =============================

  if (!buyer || (!buyer.phone && !buyer.email)) {
    throw new Error("INVALID_BUYER")
  }

  const sheet = getSheet(SHEETS.clientes)
  const data = sheet.getDataRange().getValues()

  const headers = data[0]

  const idIndex = headers.indexOf("ID_Cliente")
  const telefonoIndex = headers.indexOf("Telefono")
  const emailIndex = headers.indexOf("Email")
  const estadoIndex = headers.indexOf("Estado_checkout")
  const fechaIndex = headers.indexOf("Fecha_ultimo_intento")
  const funnelIndex = headers.indexOf("Etapa_funnel")

  // =============================
  // NORMALIZE
  // =============================

  const cleanPhone = (buyer.phone || "").toString().replace(/\s/g, "").trim()
  const cleanEmail = (buyer.email || "").toLowerCase().trim()

  // =============================
  // SEARCH EXISTING (phone OR email)
  // =============================

  for (let i = 1; i < data.length; i++) {
    const rowPhone = (data[i][telefonoIndex] || "").toString().trim()
    const rowEmail = (data[i][emailIndex] || "").toLowerCase().trim()

    const matchByPhone = cleanPhone && rowPhone === cleanPhone
    const matchByEmail = cleanEmail && rowEmail === cleanEmail

    if (matchByPhone || matchByEmail) {
      const row = i + 1

      if (fechaIndex !== -1)
        sheet.getRange(row, fechaIndex + 1).setValue(now())

      if (estadoIndex !== -1)
        sheet.getRange(row, estadoIndex + 1).setValue("iniciado")

      if (funnelIndex !== -1)
        sheet.getRange(row, funnelIndex + 1).setValue(etapa)

      return data[i][idIndex]
    }
  }

  // =============================
  // CREATE NEW CLIENT
  // =============================

  const clientId = "CL" + Date.now()

  sheet.appendRow([
    clientId,
    buyer.name || "",
    cleanPhone || "",
    cleanEmail || "",
    "",
    "",
    now(),
    0,
    "iniciado",
    now(),
    etapa,
    ""
  ])

  return clientId
}

function cliente_updateEstado(ventaId, etapa, estado) {
  try {
    const ventas = getSheet(SHEETS.ventas).getDataRange().getValues()
    const clientesSheet = getSheet(SHEETS.clientes)
    const clientes = clientesSheet.getDataRange().getValues()

    const vHeaders = ventas[0]
    const cHeaders = clientes[0]

    const ventaIdIndex = vHeaders.indexOf("VentaID")
    const clientIdIndex = vHeaders.indexOf("ID_Cliente")

    const idIndex = cHeaders.indexOf("ID_Cliente")
    const estadoIndex = cHeaders.indexOf("Estado_checkout")
    const funnelIndex = cHeaders.indexOf("Etapa_funnel")
    const fechaIndex = cHeaders.indexOf("Fecha_ultimo_intento")

    let clientId = null

    for (let i = 1; i < ventas.length; i++) {
      if (ventas[i][ventaIdIndex] === ventaId) {
        clientId = ventas[i][clientIdIndex]
        break
      }
    }

    if (!clientId) return

    for (let j = 1; j < clientes.length; j++) {
      if (clientes[j][idIndex] === clientId) {
        const row = j + 1

        clientesSheet.getRange(row, estadoIndex + 1).setValue(estado)
        clientesSheet.getRange(row, funnelIndex + 1).setValue(etapa)
        clientesSheet.getRange(row, fechaIndex + 1).setValue(now())
        return
      }
    }

  } catch (e) {
    Logger.log(e.message)
  }
}

// =============================
// CODIGOS
// =============================

function codigos_porVenta(ventaId) {
  const sheet = getSheet(SHEETS.codigos)
  const data = sheet.getDataRange().getValues()
  const headers = data[0]

  const ventaIdIndex = headers.indexOf("VentaID")

  let result = []

  for (let i = 1; i < data.length; i++) {
    if (data[i][ventaIdIndex] === ventaId) {
      result.push(i + 1)
    }
  }

  return result
}

// =============================
// CLIENT INCREMENT COMPRAS
// =============================

function cliente_incrementCompras(clientId, cantidad) {
  const sheet = getSheet(SHEETS.clientes)
  const data = sheet.getDataRange().getValues()
  const headers = data[0]

  const idIndex = headers.indexOf("ID_Cliente")
  const totalIndex = headers.indexOf("Total_cajas_compradas")

  if (idIndex === -1 || totalIndex === -1) {
    throw new Error("CLIENTES_SCHEMA_ERROR")
  }

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idIndex]).trim() === String(clientId).trim()) {

      const row = i + 1

      const current = Number(data[i][totalIndex]) || 0
      const increment = Number(cantidad) || 0

      const newTotal = current + increment

      sheet.getRange(row, totalIndex + 1).setValue(newTotal)

      Logger.log("CLIENT UPDATED:", clientId, "→", newTotal)

      return
    }
  }

  throw new Error("CLIENT_NOT_FOUND")
}

// =============================
// CONTEXTO DE CÓDIGO (FUENTE DE VERDAD)
// =============================

function getCodigoContext(codigo) {
  const codigosSheet = getSheet(SHEETS.codigos)
  const data = codigosSheet.getDataRange().getValues()
  const headers = data[0]
  
  const idx = {
    codigo: headers.indexOf("Codigo"),
    estado: headers.indexOf("Estado"),
    ventaId: headers.indexOf("VentaID"),
    fechaExpiracion: headers.indexOf("Expiracion"),
    caja: headers.indexOf("Caja"),
    bookingId: headers.indexOf("booking_id")  // puede ser -1 si no existe
  }
  
  if (idx.codigo === -1 || idx.estado === -1) throw new Error("CODIGOS_SCHEMA_ERROR")
  
  const codigoNorm = normalizeCode(codigo)
  for (let i = 1; i < data.length; i++) {
    if (normalizeCode(data[i][idx.codigo]) === codigoNorm) {
      const estado = data[i][idx.estado] || "Stock"
      const ventaId = data[i][idx.ventaId]
      const expiracion = data[i][idx.fechaExpiracion]
      const tipoBox = data[i][idx.caja] || ""
      const bookingId = idx.bookingId !== -1 ? data[i][idx.bookingId] : null
      
      // Determinar si puede reservar experiencia
      let puedeReservar = false
      if (estado === CODIGO_ESTADOS.ACTIVADA) {
        puedeReservar = true
      } else if (estado === CODIGO_ESTADOS.RESERVADA || estado === CODIGO_ESTADOS.CONFIRMADA) {
        puedeReservar = false // ya tiene booking activo
      } else {
        puedeReservar = false
      }
      
      // Verificar expiración (1 año después de venta)
      let expirado = false
      if (expiracion && new Date(expiracion) < new Date()) {
        expirado = true
        puedeReservar = false
      }
      
      // Verificar si está pagado (buscando en ventas)
      let pagado = false
      if (ventaId) {
        const venta = findVenta(getSheet(SHEETS.ventas), ventaId)
        pagado = venta && venta.estado === "pagado"
      }
      
      return {
        estado,
        booking_id: bookingId,
        puede_reservar: puedeReservar,
        pagado,
        expirado,
        tipo_box: tipoBox
      }
    }
  }
  return null // código no encontrado
}

// =============================
// CREAR RESERVA (BOOKING)
// =============================

function create_booking(payload) {
  const lock = LockService.getScriptLock()
  lock.waitLock(5000)
  try {
    const { codigo, experienciaId, fechaDeseada, cantidadPersonas, mensaje } = payload
    const sessionToken = payload.token
    
    // Validar sesión
    const beneficiarioId = validateSessionToken(sessionToken)
    if (!beneficiarioId) return { ok: false, error: "INVALID_SESSION" }
    
    // Obtener contexto del código
    const context = getCodigoContext(codigo)
    if (!context) return { ok: false, error: "CODIGO_NOT_FOUND" }
    if (!context.puede_reservar) return { ok: false, error: "CANNOT_BOOK" }
    if (context.expirado) return { ok: false, error: "CODIGO_EXPIRED" }
    
    // Verificar que el beneficiario corresponda al código
    const codigosSheet = getSheet(SHEETS.codigos)
    const data = codigosSheet.getDataRange().getValues()
    const headers = data[0]
    const idx = {
      codigo: headers.indexOf("Codigo"),
      idBeneficiario: headers.indexOf("ID_Beneficiario")
    }
    let codigoBeneficiario = null
    for (let i = 1; i < data.length; i++) {
      if (normalizeCode(data[i][idx.codigo]) === normalizeCode(codigo)) {
        codigoBeneficiario = data[i][idx.idBeneficiario]
        break
      }
    }
    if (codigoBeneficiario !== beneficiarioId) {
      return { ok: false, error: "CODE_NOT_ASSOCIATED" }
    }
    
    // Obtener datos de beneficiario
    const beneficiario = getBeneficiarioById(beneficiarioId)
    if (!beneficiario) return { ok: false, error: "BENEFICIARY_NOT_FOUND" }
    
    // Crear reserva en hoja "Reservas"
    const reservasSheet = getSheet(SHEETS.reservas)
    if (!reservasSheet) throw new Error("SHEET_RESERVAS_NOT_FOUND")
    
    const bookingId = generateBookingId()
    const nowDate = now()
    
    reservasSheet.appendRow([
      bookingId,               // ID_Reserva
      codigo,                  // Codigo
      "",                      // VentaID (se puede obtener del código si es necesario)
      beneficiario.nombre,     // Beneficiario
      beneficiario.telefono,   // Telefono
      experienciaId,           // Experiencia
      "",                      // Prestador (se obtiene de la experiencia)
      nowDate,                 // Fecha_solicitud
      fechaDeseada,            // Fecha_deseada
      "",                      // Fecha_confirmada
      "solicitada",            // Estado_reserva (usar valores de Listas)
      mensaje || ""            // Notas
    ])
    
    // Actualizar código: cambiar estado a "Reservada" y guardar booking_id
    const codigosSheet2 = getSheet(SHEETS.codigos)
    const codigosData = codigosSheet2.getDataRange().getValues()
    const codigoHeaders = codigosData[0]
    const estadoIdx = codigoHeaders.indexOf("Estado")
    const bookingIdIdx = codigoHeaders.indexOf("booking_id")
    let rowIndex = -1
    for (let i = 1; i < codigosData.length; i++) {
      if (normalizeCode(codigosData[i][idx.codigo]) === normalizeCode(codigo)) {
        rowIndex = i + 1
        break
      }
    }
    if (rowIndex !== -1) {
      codigosSheet2.getRange(rowIndex, estadoIdx + 1).setValue(CODIGO_ESTADOS.RESERVADA)
      if (bookingIdIdx !== -1) {
        codigosSheet2.getRange(rowIndex, bookingIdIdx + 1).setValue(bookingId)
      }
    }
    
    return { ok: true, bookingId }
    
  } catch (err) {
    Logger.log("create_booking ERROR: " + err.message)
    return { ok: false, error: "SERVER_ERROR" }
  } finally {
    lock.releaseLock()
  }
}

// Helper para obtener beneficiario por ID
function getBeneficiarioById(id) {
  const sheet = getSheet(SHEETS.beneficiario)
  if (!sheet) return null
  const data = sheet.getDataRange().getValues()
  const headers = data[0]
  const idIdx = headers.indexOf("ID_Beneficiario")
  const nombreIdx = headers.indexOf("Nombre")
  const telefonoIdx = headers.indexOf("Telefono")
  const emailIdx = headers.indexOf("Email")
  if (idIdx === -1) return null
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIdx] === id) {
      return {
        nombre: nombreIdx !== -1 ? data[i][nombreIdx] : "",
        telefono: telefonoIdx !== -1 ? data[i][telefonoIdx] : "",
        email: emailIdx !== -1 ? data[i][emailIdx] : ""
      }
    }
  }
  return null
}