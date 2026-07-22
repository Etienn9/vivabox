# ARCHITECTURE.md

## Core Principle

Backend is the ONLY source of truth.

Frontend is a dumb input layer.

---

## Flow

START → PAY → COMPLETE

---

## Data Model

### Ventas
- VentaID
- Estado: reservado → pagado → completado
- ClienteID

### Codigos
- Codigo
- Estado: disponible → reservado → Vendida → Activada
- VentaID

### Entregas
- Codigo
- VentaID
- Cliente / Beneficiario
- Contacto
- Email
- Tipo (digital / physical)
- Ciudad
- Direccion
- Mensaje
- Estado
- Fecha_envio
- Programado

---

## Step 3 Logic

Input:
- ventaId
- deliveryType
- mode
- items[]

Each item corresponds to 1 code.

Validation:
- items.length === codes.length
- required fields present

Output:
- Create 1 Entrega per code

---

## Scheduling Logic

Fields:
- programado: boolean
- fecha_envio: datetime

Current behavior:
- stored only
- NOT executed

---

## Missing Layer

Scheduler (critical):

Trigger:
- every X minutes

Logic:
IF programado = true
AND fecha_envio <= now
→ send
→ update estado = enviado