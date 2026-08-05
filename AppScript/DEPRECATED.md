# Obsolète — ne plus utiliser

Ce dossier contenait l'ancien backend Google Apps Script (checkout + activation
de code + réservation d'expérience, sur des Google Sheets : Ventas, Codigos,
Clientes, Beneficiario, Entregas, Reservas).

Il est remplacé intégralement par :

- **Checkout** : `src/app/api/checkout/{start,pay,complete,welcome}` + Supabase
  (`supabase/schema.sql`, tables `ventas`, `contacts`, `promo_codes`).
- **Code d'activation** : généré à `pay/route.ts`, table `activation_codes`.
- **Activation + session + réservation** (remplace `activation.gs` /
  `create_booking`) : `src/app/api/activation/{activate,verify,bookings}` +
  tables `activation_codes`, `activation_sessions`, `bookings`,
  `rate_limit_attempts` dans `supabase/schema.sql`.

## Pourquoi le remplacement

- Rate limiting non contournable : indexé sur IP + code tenté, pas sur un
  email soumis par l'appelant (`activation.gs` limitait par email — donc
  contournable en changeant simplement d'email à chaque tentative).
- Sessions à durée réelle : stockées en base avec une vraie expiration à
  7 jours (`CacheService` d'Apps Script plafonne silencieusement à 6h, un
  bug qu'`activation.gs` ne voyait pas).
- Écritures atomiques (une seule requête SQL conditionnelle) au lieu de
  plusieurs étapes séparées sur des feuilles Sheets, qui pouvaient laisser
  un état incohérent en cas d'échec au milieu du traitement.
- Une réservation active par code garantie par un index unique en base,
  pas seulement par une vérification côté application.
- Plus de scan O(n) de toute la feuille à chaque requête, plus de quotas
  d'exécution Apps Script (6 min / requête, exécutions simultanées limitées).

## Action manuelle restante

Ce repo ne peut pas désactiver le déploiement Google de son côté — si ce
script est encore déployé comme Web App, il faut le désactiver/désinstaller
depuis le compte Google du projet (éditeur Apps Script → Déploiements).
