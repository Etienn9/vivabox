// =============================
// checkout.gs – VERSION CORRIGÉE
// =============================

// Fallback local si les constantes ne sont pas encore dans config.gs
if (typeof CODIGO_ESTADOS === 'undefined') {
  var CODIGO_ESTADOS = {
    STOCK: "Stock",
    BLOQUEADA: "Bloqueada",    // checkout en cours
    VENDIDA: "Vendida",
    ACTIVADA: "Activada",
    RESERVADA: "Reservada",    // booking
    CONFIRMADA: "Confirmada",
    UTILIZADA: "Utilizada",
    CANCELADA: "Cancelada",
    PROBLEMA: "Problema"
  }
}

// =============================
// START
// =============================

function checkout_start(data) {
  const lock = LockService.getScriptLock()
  lock.waitLock(5000)

  try {
    let { box, quantity, buyer, delivery } = data

    // =============================
    // VALIDATION
    // =============================

    if (!box || !quantity || !buyer) {
      return { ok: false, error: "INVALID_INPUT" }
    }

    const qty = Number(quantity)

    if (!Number.isInteger(qty) || qty <= 0 || qty > 10) {
      return { ok: false, error: "INVALID_QUANTITY" }
    }

    // =============================
    // NORMALIZE
    // =============================

    box = String(box).toLowerCase().trim()

    const cleanBuyer = {
      name: (buyer.name || "").trim(),
      email: (buyer.email || "").trim(),
      phone: (buyer.phone || "").toString().replace(/\s/g, "").trim(), // optional
    }

    const precioUnitario = PRICE_MAP[box]
    if (!precioUnitario) {
      return { ok: false, error: "INVALID_CAJA" }
    }

    // =============================
    // DELIVERY
    // =============================

    const safeType = delivery?.type === "physical" ? "physical" : "digital"

    const allowedSpeeds = ["standard", "express", "outside"]
    const safeSpeed =
      safeType === "physical"
        ? allowedSpeeds.includes(delivery?.speed)
          ? delivery.speed
          : "standard"
        : null

    function getDeliveryPrice(type, speed, qty) {
      if (type !== "physical") return 0

      let base = 0
      if (speed === "express") base = 10000
      else if (speed === "outside") base = 15000

      if (qty <= 1) return base
      if (qty <= 3) return base + 5000
      return base + 10000
    }

    const deliveryPrice = getDeliveryPrice(safeType, safeSpeed, qty)
    const subtotal = precioUnitario * qty
    const total = subtotal + deliveryPrice

    const ventaId = "VT" + Date.now()

    const ventasSheet = getSheet(SHEETS.ventas)
    const codigosSheet = getSheet(SHEETS.codigos)

    // =============================
    // CLIENT
    // =============================

    const clientId = cliente_upsert(cleanBuyer, "elegir")

    // =============================
    // LOAD CODES
    // =============================

    const lastRow = codigosSheet.getLastRow()
    const lastCol = codigosSheet.getLastColumn()

    const codigos = codigosSheet.getRange(1, 1, lastRow, lastCol).getValues()
    const headers = codigos[0]

    const estadoIndex = headers.indexOf("Estado")
    const cajaIndex = headers.indexOf("Caja")
    const ventaIdIndex = headers.indexOf("VentaID")
    const fechaIndex = headers.indexOf("Fecha_reserva")
    const canalIndex = headers.indexOf("Canal_venta")
    const clienteIndex = headers.indexOf("Cliente")
    const idClienteIndex = headers.indexOf("ID_Cliente")

    if (
      estadoIndex === -1 ||
      cajaIndex === -1 ||
      ventaIdIndex === -1
    ) {
      throw new Error("CODIGOS_SCHEMA_ERROR")
    }

    // =============================
    // FIND AVAILABLE (Stock uniquement)
    // =============================

    let assignedRows = []

    for (let i = 1; i < codigos.length; i++) {
      if (
        codigos[i][estadoIndex] === CODIGO_ESTADOS.STOCK &&
        codigos[i][cajaIndex] === box
      ) {
        assignedRows.push(i)
      }
      if (assignedRows.length === qty) break
    }

    if (assignedRows.length < qty) {
      return { ok: false, error: "NO_STOCK" }
    }

    // =============================
    // UPDATE IN MEMORY : passage en "Bloqueada"
    // =============================

    assignedRows.forEach(i => {
      codigos[i][estadoIndex] = CODIGO_ESTADOS.BLOQUEADA  // au lieu de "Reservada"
      codigos[i][ventaIdIndex] = ventaId

      if (fechaIndex !== -1) codigos[i][fechaIndex] = now()
      if (canalIndex !== -1) codigos[i][canalIndex] = "Web"
      if (clienteIndex !== -1) codigos[i][clienteIndex] = cleanBuyer.name
      if (idClienteIndex !== -1) codigos[i][idClienteIndex] = clientId
    })

    // =============================
    // WRITE BACK
    // =============================

    codigosSheet
      .getRange(1, 1, codigos.length, codigos[0].length)
      .setValues(codigos)

    // =============================
    // INSERT VENTA
    // =============================

    const ventasHeaders = ventasSheet.getRange(1,1,1,ventasSheet.getLastColumn()).getValues()[0]
    const newRow = new Array(ventasHeaders.length).fill("")

    function set(field, value) {
      const i = ventasHeaders.indexOf(field)
      if (i !== -1) newRow[i] = value
    }

    set("VentaID", ventaId)
    set("Fecha_creacion", now())
    set("Caja", box)
    set("Cantidad", qty)

    set("Precio_unitario", precioUnitario)
    set("Subtotal", subtotal)
    set("Precio_envio", deliveryPrice)
    set("Total", total)

    set("Pricing_version", "v3_fast")

    set("Canal_venta", "Web")
    set("ID_Cliente", clientId)

    set("Cliente", cleanBuyer.name)
    set("Email", cleanBuyer.email)
    set("Telefono", cleanBuyer.phone) // optional

    set("Estado", "creada")

    set("Tipo_entrega", safeType)
    set("Velocidad_entrega", safeSpeed)

    set("Fecha_expiracion_reserva", futureMinutes(30))

    ventasSheet.appendRow(newRow)

    // =============================
    // RESPONSE
    // =============================

    return {
      ok: true,
      ventaId,
      pricing: {
        subtotal,
        delivery: deliveryPrice,
        total
      }
    }

  } catch (err) {
    console.error("START ERROR:", err)
    return { ok: false, error: "SERVER_ERROR" }
  } finally {
    lock.releaseLock()
  }
}

// =============================
// PAY (HARDENED + EXPIRATION)
// =============================

function checkout_pay(data) {
  const lock = LockService.getScriptLock()
  lock.waitLock(5000)

  try {
    const { ventaId } = data

    if (!ventaId) {
      return { ok: false, error: "INVALID_INPUT" }
    }

    const ventasSheet = getSheet(SHEETS.ventas)
    const codigosSheet = getSheet(SHEETS.codigos)

    const ventas = ventasSheet.getDataRange().getValues()
    const headers = ventas[0]

    const ventaIdCol = headers.indexOf("VentaID")
    const estadoIndex = headers.indexOf("Estado")
    const fechaPagoIndex = headers.indexOf("Fecha_pago")
    const cantidadIndex = headers.indexOf("Cantidad")
    const clientIdIndex = headers.indexOf("ID_Cliente")
    const fechaExpIndex = headers.indexOf("Fecha_expiracion_reserva")

    if (
      ventaIdCol === -1 ||
      estadoIndex === -1 ||
      fechaPagoIndex === -1
    ) {
      throw new Error("VENTAS_SCHEMA_ERROR")
    }

    // =============================
    // FIND VENTA
    // =============================
    let ventaRow = -1
    let venta = null

    for (let i = 1; i < ventas.length; i++) {
      if (ventas[i][ventaIdCol] === ventaId) {
        ventaRow = i + 1
        venta = ventas[i]
        break
      }
    }

    if (ventaRow === -1) {
      return { ok: false, error: "VENTA_NOT_FOUND" }
    }

    const estadoActual = venta[estadoIndex]
    const fechaExp = fechaExpIndex !== -1 ? venta[fechaExpIndex] : null

    // =============================
    // STATE GUARD
    // =============================
    if (estadoActual === "pagado") {
      return { ok: true, alreadyPaid: true }
    }

    if (estadoActual !== "creada") {
      return { ok: false, error: "INVALID_STATE" }
    }

    if (fechaExp && new Date() > new Date(fechaExp)) {
      return { ok: false, error: "RESERVATION_EXPIRED" }
    }

    // =============================
    // LOAD CODIGOS
    // =============================
    const codigos = codigosSheet.getDataRange().getValues()
    const cHeaders = codigos[0]

    const ventaIdIndex = cHeaders.indexOf("VentaID")
    const estadoCodIndex = cHeaders.indexOf("Estado")
    const fechaVentaIndex = cHeaders.indexOf("Fecha_venta")
    const expiracionIndex = cHeaders.indexOf("Expiracion")

    if (
      ventaIdIndex === -1 ||
      estadoCodIndex === -1 ||
      expiracionIndex === -1
    ) {
      throw new Error("CODIGOS_SCHEMA_ERROR")
    }

    let codigosVenta = []

    for (let i = 1; i < codigos.length; i++) {
      if (codigos[i][ventaIdIndex] === ventaId) {
        codigosVenta.push(i + 1)
      }
    }

    if (codigosVenta.length === 0) {
      return { ok: false, error: "NO_CODES_LINKED" }
    }

    // Vérifier que tous les codes sont bien en "Bloqueada" (et non "Reservada")
    for (let row of codigosVenta) {
      const estado = codigos[row - 1][estadoCodIndex]
      if (estado !== CODIGO_ESTADOS.BLOQUEADA) {
        return { ok: false, error: "INVALID_CODE_STATE" }
      }
    }

    // =============================
    // UPDATE VENTA
    // =============================
    ventasSheet.getRange(ventaRow, estadoIndex + 1).setValue("pagado")
    ventasSheet.getRange(ventaRow, fechaPagoIndex + 1).setValue(now())

    // =============================
    // CLIENT UPDATE
    // =============================
    try {
      cliente_updateEstado(ventaId, "pago_ok", "pagado")
    } catch (e) {
      Logger.log("CLIENT UPDATE ERROR: " + e.message)
    }

    // =============================
    // CLIENT STATS
    // =============================
    try {
      const clientId = venta[clientIdIndex]
      const cantidad = Number(venta[cantidadIndex]) || 0

      if (clientId && cantidad > 0) {
        cliente_incrementCompras(clientId, cantidad)
      }
    } catch (e) {
      Logger.log("CLIENT TOTAL ERROR: " + e.message)
    }

    // =============================
    // PREPARE DATES
    // =============================
    const nowDate = now()

    const expirationDate = new Date(nowDate)
    expirationDate.setFullYear(expirationDate.getFullYear() + 1)

    // =============================
    // UPDATE CODES : passage en "Vendida"
    // =============================
    for (let row of codigosVenta) {
      codigosSheet.getRange(row, estadoCodIndex + 1).setValue(CODIGO_ESTADOS.VENDIDA)

      if (fechaVentaIndex !== -1) {
        codigosSheet.getRange(row, fechaVentaIndex + 1).setValue(nowDate)
      }

      // Expiration à +1 an
      codigosSheet.getRange(row, expiracionIndex + 1).setValue(expirationDate)
    }

    return { ok: true }

  } catch (err) {
    return {
      ok: false,
      error: "SERVER_ERROR",
      detail: err.message
    }
  } finally {
    lock.releaseLock()
  }
}

// =============================
// COMPLETE (inchangé)
// =============================

function checkout_complete(data) {
  const lock = LockService.getScriptLock()
  lock.waitLock(10000)

  try {
    const { ventaId, items, delivery } = data

    if (!ventaId || !items || !items.length) {
      throw new Error("INVALID_INPUT")
    }

    // =============================
    // NORMALIZE DELIVERY TYPE
    // =============================

    const deliveryType = normalizeDeliveryType(delivery?.type)

    if (!deliveryType) {
      throw new Error("INVALID_DELIVERY_TYPE")
    }

    const entregasSheet = getSheet(SHEETS.entregas)
    const codigosSheet = getSheet(SHEETS.codigos)

    const codigos = codigosSheet.getDataRange().getValues()
    const headers = codigos[0]

    const ventaIdIndex = headers.indexOf("VentaID")
    const codigoIndex = headers.indexOf("Codigo")

    if (ventaIdIndex === -1 || codigoIndex === -1) {
      throw new Error("CODIGOS_SCHEMA_ERROR")
    }

    // =============================
    // GET CODES
    // =============================

    const codes = []

    for (let i = 1; i < codigos.length; i++) {
      if (codigos[i][ventaIdIndex] === ventaId) {
        codes.push(codigos[i][codigoIndex])
      }
    }

    if (codes.length !== items.length) {
      throw new Error("ITEMS_CODES_MISMATCH")
    }

    // =============================
    // GET CLIENT DATA FROM VENTAS
    // =============================

    const ventaData = getVentaData(ventaId)

    // =============================
    // BUILD ROWS
    // =============================

    const newRows = items.map((item, index) => [
      codes[index],                         // A Codigo
      ventaId,                              // B VentaID

      item.de || ventaData.nombre || "",    // C Remitente
      item.para || "",                      // D Beneficiario

      item.contacto || "",                  // E Telefono
      ventaData.email || "",                // F Email

      deliveryType,                         // G Tipo_entrega

      item.ciudad || "",                    // H Ciudad
      item.direccion || "",                 // I Direccion
      item.detalles || "",                  // J Detalles

      item.mensaje || "",                   // K Mensaje

      "pendiente",                          // L Estado_entrega

      item.fecha_envio || "",               // M Fecha_envio
      item.hora_envio || "",                // N Hora_envio

      item.programado ? "yes" : "no",       // O Programado

      ""                                    // P Fecha_entregado
    ])

    // =============================
    // WRITE
    // =============================

    const startRow = entregasSheet.getLastRow() + 1

    entregasSheet
      .getRange(startRow, 1, newRows.length, newRows[0].length)
      .setValues(newRows)

    // =============================
    // UPDATE CLIENT FUNNEL 🔥
    // =============================

    try {
      cliente_updateEstado(ventaId, "envio", "completado")
    } catch (e) {
      Logger.log("CLIENT UPDATE ERROR: " + e.message)
    }

    return { ok: true }

  } catch (err) {
    console.error("COMPLETE ERROR:", err)
    return { ok: false, error: err.message }
  } finally {
    lock.releaseLock()
  }
}


// =============================
// GET VENTA DATA
// =============================

function getVentaData(ventaId) {
  const sheet = getSheet(SHEETS.ventas)
  const data = sheet.getDataRange().getValues()
  const headers = data[0]

  const ventaIdIndex = headers.indexOf("VentaID")
  const nombreIndex = headers.indexOf("Nombre")
  const emailIndex = headers.indexOf("Email")

  if (ventaIdIndex === -1) {
    throw new Error("VENTAS_SCHEMA_ERROR")
  }

  for (let i = 1; i < data.length; i++) {
    if (data[i][ventaIdIndex] === ventaId) {
      return {
        nombre: nombreIndex !== -1 ? data[i][nombreIndex] || "" : "",
        email: emailIndex !== -1 ? data[i][emailIndex] || "" : ""
      }
    }
  }

  return { nombre: "", email: "" }
}


// =============================
// NORMALIZE
// =============================

function normalizeDeliveryType(type) {
  if (!type) return null

  const t = String(type).toLowerCase()

  if (t === "physical" || t === "fisico") return "fisico"
  if (t === "digital") return "digital"

  return null
}