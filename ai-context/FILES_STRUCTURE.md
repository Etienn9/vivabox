# FILES_STRUCTURE.md

## Overview

This document explains the full structure of the Vivabox project (frontend + backend), including:
- file paths
- responsibilities
- what each file contains
- how they interact together

The system is composed of:
- Next.js frontend (App Router)
- Zustand state management
- API routes (Next.js → Apps Script)
- Google Apps Script backend
- Google Sheets database

---

# FRONTEND (Next.js)

Root:

/src


---

## 1. App Router Structure

### `/src/app`

Main application routing layer.

---

### `/src/app/checkout/[slug]/page.tsx`

## Role:
Entry point for checkout of a specific box.

## Responsibilities:
- Reads `slug` from URL
- Finds corresponding box in `/data/boxes`
- Passes normalized data to `ProductStep`

## Outputs:
- Checkout step 1 UI (Elegir)

---

### `/src/app/checkout/components/ProductStep.tsx`

## Role:
Core of STEP 1 (Elegir)

## Responsibilities:
- Display product info
- Handle:
  - quantity
  - delivery type (digital / physical)
  - delivery speed
  - buyer info (name, phone, email)
- Stores all data in Zustand (`checkoutStore`)

## Critical Logic:
- `handleGoToPayment()`
  - Sends request to `/api/venta`
  - Creates initial sale (STEP 1)
  - Should:
    - create cliente
    - reserve code
  - Then redirects to `/pago`

⚠️ Current Risk:
- Can trigger duplicate calls
- Must only be called once

---

### `/src/app/checkout/[slug]/pago/page.tsx`

## Role:
STEP 2 (Payment)

## Responsibilities:
- Display payment UI (fake MercadoPago for now)
- Reads data from Zustand store
- Calls `/api/venta` again (⚠️ current issue)

## Critical Problem:
- Reuses same endpoint as STEP 1
- Causes:
  - duplicate ventas
  - code overwrite

---

### `/src/app/checkout/[slug]/success/page.tsx`

## Role:
STEP 3 (Post-payment / completion)

## Responsibilities:
- Displays confirmation
- Handles:
  - beneficiary input
  - delivery info
- Sends `type: completion` to Apps Script

---

### `/src/app/checkout/components/CheckoutSummary.tsx`

## Role:
UI component

## Responsibilities:
- Displays order summary:
  - box
  - quantity
  - delivery
  - total

---

### `/src/app/checkout/components/CheckoutProgress.tsx`

## Role:
Progress bar

## Steps:
- Elegir
- Pagar
- Enviar

---

---

# STATE MANAGEMENT

## `/src/features/checkout/checkoutStore.ts`

## Role:
Global checkout state (Zustand)

## Stores:

### Product
- box
- quantity

### Buyer
- buyerName
- buyerPhone
- buyerEmail

### Delivery
- deliveryType
- deliverySpeed

### System
- hasHydrated
- multiBeneficiary

---

## Key Functions:

### setBuyer()
Stores client data

### setDelivery()
Stores delivery selection

### getTotal()
Calculates total price

### isValidForPayment()
Validation logic

---

## Missing (Important):
- ventaId
- codes

⚠️ This caused previous TypeScript errors

---

---

# API LAYER (Next.js)

## `/src/app/api/venta/route.ts`

## Role:
Bridge between frontend and Apps Script

## Responsibilities:
- Receive checkout payload
- Validate data
- Normalize structure
- Send to Apps Script

---

## Payload Sent:

```json
{
  "caja": "...",
  "cantidad": 1,
  "total": 395000,
  "canalVenta": "Web",
  "cliente": {
    "nombre": "...",
    "telefono": "...",
    "email": "..."
  },
  "entrega": {
    "tipo": "...",
    "velocidad": "..."
  },
  "estadoCheckout": "step1_created"
}
Critical Issue:

Same endpoint used for:

STEP 1 (create)
STEP 2 (payment)

→ causes duplication

BACKEND (Google Apps Script)

Single file system.

Entry Points
doGet()

Health check

Returns:

VIVABOX_API_V2_OK
doPost(e)
Role:

Main router

Logic:
parse request
if type === completion → handleCompletion
else → handleVenta
handleVenta(data)
Role:

STEP 1 (creation)

Actions:
Read payload
Create / find Cliente
Update Cliente tracking
Create Venta
Assign codes
Sheets used:
Clientes
Ventas
Codigos
assignCode(...)
Role:

Assign available code

Logic:
Find first row where:
caja matches
estado = "Stock"
Updates:
estado (should be Reservada)
fecha
canal
cliente

⚠️ Current Issue:

overwritten later
or wrong execution timing
getOrCreateCliente(...)
Role:

Client deduplication

Logic:
search by phone
if exists → return ID
else → create new row
updateClienteTracking(...)
Role:

Update funnel tracking

Updates:
Estado checkout
Last interaction date
Funnel stage
handleCompletion(payload)
Role:

STEP 3

Actions:
Create Beneficiario
Create Entregas
Update Codigos
DATA (Google Sheets)
Sheets:
Codigos

Operational truth of product lifecycle

Clientes

Tracking + CRM

Ventas

Transaction log

Beneficiario

End-user data

Entregas

Delivery tracking

FLOW SUMMARY
STEP 1

ProductStep → /api/venta → Apps Script → Sheets

STEP 2

PagoPage → /api/venta AGAIN → ❌ problem

STEP 3

SuccessPage → /api/venta (completion type)

CRITICAL ARCHITECTURE FLAW

👉 One endpoint used for multiple responsibilities

Should be:

/checkout/start
/checkout/pay
/checkout/complete
CURRENT PRIORITY

Fix:

endpoint separation
code assignment timing
prevent duplicate execution
MENTAL MODEL

Frontend = orchestrator
Apps Script = executor
Sheets = source of truth

FINAL NOTE

The system is already 70% functional.

Remaining issues are:

architectural (not technical)
related to flow separation and state control