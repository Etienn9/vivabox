# EDGE_CASES.md

## 1. Double Submit

User clicks twice:
→ duplicate Entregas

Solution:
- idempotency check

---

## 2. Missing Items

Mismatch between codes and items:
→ reject request

---

## 3. Invalid State

Complete without payment:
→ must be rejected

---

## 4. Scheduling in Past

User selects past date:
→ must reject or auto-send

---

## 5. Partial Input

Some items filled, others not:
→ reject

---

## 6. Network Retry

Frontend retries request:
→ must not duplicate rows