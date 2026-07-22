// =============================
// CONFIG
// =============================

const SHEETS = {
  ventas: "Ventas",
  codigos: "Codigos",
  clientes: "Clientes",
  beneficiario: "Beneficiario",
  entregas: "Entregas",
  reservas: "Reservas"      // NUEVO
}

const PRICE_MAP = {
  esencia: 185000,
  selecta: 395000,
  excepcion: 875000
}

// ESTADOS VÁLIDOS PARA CODIGOS
const CODIGO_ESTADOS = {
  STOCK: "Stock",
  BLOQUEADA: "Bloqueada",    // antes "Reservada" (checkout)
  VENDIDA: "Vendida",
  ACTIVADA: "Activada",
  RESERVADA: "Reservada",    // booking solicitado
  CONFIRMADA: "Confirmada",
  UTILIZADA: "Utilizada",
  CANCELADA: "Cancelada",
  PROBLEMA: "Problema"
}

// Transiciones permitidas para VENTAS (sin cambios)
const VALID_TRANSITIONS = {
  creada: ["pagado"],
  pagado: ["completado"],
  completado: []
}