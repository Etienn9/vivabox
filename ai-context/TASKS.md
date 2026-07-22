# TASKS.md — VIVABOX SYSTEM

## 🔴 PRIORITY 1 — POST-ACTIVATION FLOW

1. Create route `/activacion-completa`
2. Build success UI (card aligned with design system)
3. Implement redirect after activation
4. Store token in sessionStorage
5. Retrieve token in `/mapa`
6. Add guard:
   - if no token → redirect to activation

---

## 🟠 PRIORITY 2 — UX CONSISTENCY

7. Define success messaging:
   - title + subtext
8. Remove redundant activation messages
9. Add transition (simple fade)
10. Ensure visual consistency across pages

---

## 🟡 PRIORITY 3 — SYSTEM CONSISTENCY

11. Define lifecycle states:
    - Stock → Vendida → Activada → Usada
12. Align states across:
    - Codigos
    - Ventas
    - Clientes
13. Prevent invalid state transitions

---

## 🟢 PRIORITY 4 — OBSERVABILITY

14. Add structured logs:
    - activation success
    - activation failure
    - fraud attempts
15. Add audit trail per code

---

## 🔵 PRIORITY 5 — RESERVATION SYSTEM

16. Design experience selection system
17. Build availability logic
18. Build reservation flow
19. Add confirmation + provider notification

---

## ⚫ LATER

20. Advanced anti-fraud rules
21. Provider dashboard
22. Admin panel
23. Metrics dashboard (activation rate, usage, etc.)
