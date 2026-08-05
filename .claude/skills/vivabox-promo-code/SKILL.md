---
name: vivabox-promo-code
description: Créer, désactiver, supprimer ou lister les codes promo Vivabox (campagnes, influenceurs, partenaires) directement dans Supabase. Utiliser quand l'utilisateur demande de créer un code promo, de le désactiver/supprimer, ou de voir les codes actifs.
---

# Gérer les codes promo Vivabox

## Contexte

Les codes promo vivent dans la table Supabase `promo_codes` (schéma dans
`supabase/schema.sql`). Un seul effet existe aujourd'hui : `free_shipping`
(livraison offerte). Deux origines partagent la même table :

- **Codes de bienvenue** : générés automatiquement par le site (`src/app/api/checkout/welcome/route.ts`),
  un par email, usage unique. Ne pas y toucher avec ce skill.
- **Codes de campagne** (influenceurs, partenaires, promotions) : créés à la
  main, réutilisables, plafond configurable. C'est ce que ce skill gère.

Toute la gestion passe par `scripts/promo-codes.mjs`, exécuté avec le Bash
tool depuis la racine du repo :

```
node --env-file=.env.local scripts/promo-codes.mjs create --code=MARIA --maxUses=200 --expiresAt=2026-08-31 --label="Campaña Maria IG"
node --env-file=.env.local scripts/promo-codes.mjs deactivate --code=MARIA
node --env-file=.env.local scripts/promo-codes.mjs delete --code=MARIA
node --env-file=.env.local scripts/promo-codes.mjs list
```

Le script parle directement à Supabase (service role key depuis `.env.local`,
chargée par le flag natif `--env-file` — pas besoin de dotenv). Aucun autre
outil n'est nécessaire : ne pas éditer la base à la main, ne pas proposer de
SQL à coller.

## Flux de travail

1. **Créer** : l'utilisateur donne un code (obligatoire — c'est un code de
   campagne mémorable, ne pas en inventer un si non fourni, demander plutôt).
   Champs optionnels : `--maxUses` (entier ; omis = illimité), `--expiresAt`
   (AAAA-MM-JJ ; omis = jamais), `--label` (note libre pour se souvenir du
   contexte : nom de la campagne, de l'influenceur...), `--source` (texte
   libre, défaut `campaign`). Ne jamais fixer `type` autrement que
   `free_shipping` — c'est le seul type supporté par le checkout actuellement.
   Lancer la commande, puis confirmer à l'utilisateur ce qui a été créé
   (code, plafond, expiration) en une phrase.

2. **Désactiver** : rendre un code inutilisable immédiatement sans le
   supprimer (garde l'historique intact pour les ventes déjà passées avec ce
   code). C'est le comportement par défaut pour "supprime ce code" — préférer
   `deactivate` à `delete` sauf si l'utilisateur insiste explicitement sur une
   suppression définitive d'un code jamais utilisé (faute de frappe par ex.).

3. **Supprimer** : uniquement pour un code jamais utilisé (`uses_count = 0`).
   Le script refuse sinon avec un message clair — dans ce cas, proposer
   `deactivate` à la place plutôt que de forcer.

4. **Lister** : montrer les codes actifs (et leur usage `count/max`) quand
   l'utilisateur demande un état des lieux. Résumer la sortie proprement,
   pas besoin de coller le texte brut du terminal.

## Ce que ce skill ne fait pas

- Pas de remise en pourcentage/montant fixe — seul `free_shipping` existe.
  Si demandé, dire que ça nécessite d'étendre le schéma (`type` check
  constraint) d'abord, pas quelque chose que ce skill peut improviser.
- Ne touche jamais aux codes `source = 'first_purchase_welcome'` (générés
  automatiquement à chaque premier achat) sauf demande explicite.
