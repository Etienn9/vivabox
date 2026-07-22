# CURRENT ISSUES

## 1. VALIDATION GOOGLE SHEETS

Erreur :
"cellule ne respecte pas validation"

CAUSE :
dropdowns + valeurs non alignées

---

## 2. CLIENTES BLOQUE PAIEMENT

updateClienteEstado casse le flow

---

## 3. MANQUE VALIDATIONS BACKEND

STEP 2 :
- pas de check estado
- pas de check expiration
- pas de check codes

---

## 4. COUPLING FORT

Backend dépend de:
- noms colonnes exacts
- validations sheets

---

## 5. RISQUE MAJEUR

Paiement peut échouer pour raisons non métier

---

## CONCLUSION

Le problème n’est PAS le code principal  
→ c’est l’architecture autour