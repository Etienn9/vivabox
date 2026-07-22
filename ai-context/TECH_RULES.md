# Vivabox — Technical Rules

## 🔥 Principes

1. Source unique de vérité → Codigos
2. Éviter duplication de données
3. Toutes les actions critiques = atomiques
4. Toujours valider côté backend (jamais confiance frontend)

---

## 🚫 Anti-patterns à éviter

- Lire 3 tables pour reconstruire un état
- Laisser frontend décider des états
- Permettre double activation
- Mélanger logique checkout et activation

---

## ✅ Bonnes pratiques

- Normaliser les inputs
- Utiliser des enums clairs (Estado)
- Logs explicites (erreurs backend)
- Idempotency sur actions critiques

---

## 🧠 Naming

- Cliente = acheteur
- Beneficiario = utilisateur final
- Remitente = "De"
- Codigo = clé système centrale

---

## ⚙️ Endpoints séparés

- checkout_complete
- activate_code
- choose_experience
- create_reservation

NE PAS mélanger