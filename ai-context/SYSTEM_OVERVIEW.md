# Vivabox — System Overview

## 🎯 Objectif
Construire un système fiable de gifting expérientiel en Colombie :
- Achat (cliente)
- Livraison (beneficiario)
- Activation (beneficiario)
- Réservation (beneficiario)
- Exécution (prestador)

---

## 🧠 Acteurs

### Cliente (payer)
- Achète la box
- Source du revenu
- Priorité business

### Beneficiario
- Reçoit la box
- Active le code
- Choisit l’expérience
- Ambassadeur émotionnel

### Prestador
- Fournit l’expérience
- Doit être fiable et valorisé

---

## 🧱 Architecture actuelle (Sheets)

### Codigos (SOURCE DE VÉRITÉ)
- 1 ligne = 1 box
- Contient état complet du cycle

### Ventas
- 1 achat
- lié à cliente

### Clientes
- base CRM

### Entregas
- log de livraison (digital / físico)

### Beneficiario
- identité du receveur (post-activation)

### Experiencias
- catalogue

---

## 🔁 Cycle de vie d’un code

Stock → Reservada → Vendida → Activada → Experiencia_elegida → Reserva_solicitada → Confirmada → Utilizada → Cerrada

+ Cancelada / Problema / Expirada

---

## ⚠️ Règle clé

👉 Activation = moment où :
- le code est verrouillé
- un bénéficiaire est attaché
- accès aux expériences est débloqué

---

## 🔐 Contraintes critiques

- 1 code = 1 activation unique
- Pas de réactivation
- Expiration = 12 mois après achat
- Le bénéficiaire ne voit jamais le prix
- Le système ne montre que les expériences valides

---

## 📊 KPIs

- Activation > 70%
- Satisfaction > 4.5
- Confirmations < 48h
- Usage > 60%
- NPS prestadores > 40