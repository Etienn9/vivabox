# PRINCIPLES.md

## 1. Deterministic System

Every action must produce predictable output.

No hidden logic.

---

## 2. One Step = One Responsibility

START → stock
PAY → money
COMPLETE → delivery

No overlap.

---

## 3. Backend Authority

Frontend cannot:
- invent data
- decide logic
- override state

---

## 4. No Implicit Behavior

Everything must be explicit:
- mode
- items
- deliveryType

---

## 5. Idempotency (NOT YET IMPLEMENTED)

Same request should not duplicate data.

---

## 6. Separation of Actors

Client (buyer) ≠ Beneficiary ≠ Provider

Never mix.

---

## 7. System over UI

UI can change.

System must remain stable.