# Vivabox — Data Model

## 📦 Codigos (table centrale)

| Champ | Description |
|------|------------|
| Codigo | Unique |
| Caja | type box |
| Estado | cycle de vie |
| VentaID | lien achat |
| Fecha_venta | timestamp |
| ID_Cliente | acheteur |
| Cliente | nom |
| ID_Beneficiario | après activation |
| Fecha_activacion | activation |
| Expiracion | Fecha_venta + 12 mois |

---

## 👤 Clientes

| Champ | Description |
|------|------------|
| ID_Cliente | unique |
| Cliente | nom |
| Telefono | |
| Email | |
| Estado_checkout | pago_ok, etc |
| Etapa_funnel | suivi |

---

## 🎁 Beneficiario

| Champ | Description |
|------|------------|
| ID_Beneficiario | unique |
| Nombre | |
| Email | |
| Telefono | (optionnel au début) |
| Codigo | lien code |
| VentaID | |
| Fecha_creacion | |

---

## 🚚 Entregas

| Champ | Description |
|------|------------|
| Codigo | |
| VentaID | |
| Remitente | "De" |
| Beneficiario | "Para" |
| Telefono | |
| Email | |
| Tipo_entrega | fisico / digital |
| Ciudad | |
| Direccion | |
| Detalles | |
| Mensaje | |
| Fecha_envio | |
| Hora_envio | |
| Programado | yes/no |

---

## 🎯 Regla importante

👉 Codigos = source of truth  
👉 Les autres tables = projections / logs