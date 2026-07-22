# DECISIONS.md — VIVABOX

## 🧠 CORE ARCHITECTURE

- Codigos.Estado = single source of truth (state only)
- Relational chain:
  Codigos → VentaID → ClienteID
- Codigos.ID_Cliente is deprecated and ignored

---

## 🔐 DATA INTEGRITY

- Activation requires:
  - Codigos.Estado == "Vendida"
  - Ventas.Estado == "pagado"
  - Clientes.Estado_checkout == "completado"
- All comparisons must be string-normalized (trim + string)

---

## 🔁 IDEMPOTENCE

- If code already activated:
  → return existing token
  → no duplicate Beneficiario
- Never block success after a successful write

---

## ⚙️ ACTIVATION FLOW

1. Validate input
2. Find code (safe comparison)
3. Idempotence check
4. Validate estado + expiration
5. Cross-validation (Ventas + Clientes)
6. Create Beneficiario
7. Update Codigos
8. Return token

---

## 🧾 ERROR HANDLING

- No silent crashes allowed
- All header lookups must be validated
- Avoid undefined access (safe() usage)
- If partial success → return success (token fallback)

---

## 🧩 FRONTEND STRATEGY

- Frontend must be defensive:
  - tolerate malformed backend responses
  - force success if token exists
- Use sessionStorage for token (NOT URL)

---

## 🔐 TOKEN STRATEGY

- Token stored in sessionStorage:
  - key: `vb_token`
- Token is NOT exposed in URL
- `/mapa` retrieves token from sessionStorage

---

## 🎯 UX FLOW

Activation → Success page → Experience selection

- Route:
  `/activacion-completa`
- Success page purpose:
  guide next action (choose experience)

---

## 🎨 UX PRINCIPLES

- Simplicity first (understood in 10 seconds)
- No redundant messages
- Clear next step always visible
- No technical friction

---

## 🧱 FRONTEND STRUCTURE

- Use routing (Next.js), not local state for success
- Each step = its own page
- Guard routes when required (token presence)

---

## 🚫 ANTI-PATTERNS REMOVED

- Multiple sources of truth
- Direct ID_Cliente usage in Codigos
- Raw equality checks (=== without normalization)
- Token in URL
