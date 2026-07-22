# WHATSAPP FLOWS

## Objective

Use WhatsApp as the primary operational and recovery channel.

Goals:
- ensure completion after purchase
- resolve delivery issues بسرعة
- increase activation rate
- reduce support friction

Tone:
- warm
- simple
- human (Mariana)
- no corporate language

---

## Core Principles

1. WhatsApp is not support, it is part of the product
2. Messages must feel personal, not automated
3. Always guide, never overwhelm
4. One clear action per message
5. Speed > perfection

---

## Flow 1 — Post-Payment Completion Reminder

### Trigger:
- Order paid
- completion_done = false
- delay: 5–10 minutes

### Message:

Hola 😊  
Soy Mariana de Vivabox  

Tu regalo ya está listo 🎁  
Solo falta un detalle para poder enviarlo  

👉 Completar ahora: [link]

Toma menos de 30 segundos

---

## Flow 2 — Second Reminder (if no action)

### Trigger:
- 24h after payment
- still incomplete

### Message:

Hola 😊  
Te escribo porque tu regalo sigue pendiente de envío  

Para que la otra persona lo reciba, falta completarlo aquí:  
👉 [link]

Si necesitas ayuda, estoy aquí 🙌

---

## Flow 3 — Delivery Mismatch (Important)

### Trigger:
- Address خارج Bogotá/Cundinamarca
- delivery_national = false

### Message:

Hola 😊  

Vimos que el envío es para otra ciudad  

Para poder enviarlo, necesitamos activar el envío nacional (+$15.000)  

¿Quieres que lo hagamos por aquí?

---

## Flow 4 — Confirmation After Completion

### Trigger:
- completion_done = true

### Message:

Perfecto 🙌  

Tu regalo ya quedó listo para enviar 🎁  

Te avisamos cuando haya sido entregado

---

## Flow 5 — Delivery Confirmation

### Trigger:
- delivery_confirmed = true

### Message:

Tu regalo ya fue entregado 🎉  

Ahora solo queda disfrutar la experiencia 🙌

---

## Flow 6 — Invalid Contact / Error

### Trigger:
- delivery failed
- invalid recipient contact

### Message:

Hola 😊  

Tuvimos un problema al enviar el regalo  

¿Nos puedes confirmar el contacto correcto?  
Así lo enviamos sin problema 🙌

---

## Flow 7 — Upsell (Optional - Later Stage)

### Trigger:
- after delivery

### Message:

Qué bueno ese regalo 🙌  

Si quieres hacer otro fácil, aquí puedes ver más opciones:  
👉 [link]

---

## Technical Rules

- Always include short links
- Never send long messages
- Never send multiple CTAs
- Delay messages slightly (avoid instant bot feeling)
- Log all interactions

---

## Operational Rules

- Human takeover possible at any time
- Mariana tone must remain consistent
- Avoid robotic patterns
- Prioritize clarity over branding

---

## KPI Targets

- Completion rate after reminder > 70%
- Response rate > 60%
- Issue resolution time < 2h
- Drop-off after payment < 20%

---

## Critical Insight

If WhatsApp fails:
→ gifts are not sent
→ experience breaks
→ brand loses trust

WhatsApp is not optional.
It is core infrastructure.