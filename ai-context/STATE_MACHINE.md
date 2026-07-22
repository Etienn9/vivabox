# STATE MACHINE — VIVABOX

## VENTAS

creada → pagado → completado
↘ cancelado

---

## CODIGOS

Stock → Reservada → Vendida → Activada
↘ Cancelada

---

## CLIENTES (tracking only)

iniciado → pagado → completado

---

## RÈGLES ABSOLUES

- impossible de skip un état
- impossible de revenir en arrière
- chaque transition validée backend

---

## ERREURS ACTUELLES

- validations manquantes
- CLIENTES trop critique
- états non protégés

---

## OBJECTIF

State machine **déterministe**