# Vivabox — État du Projet

> Dernière mise à jour : reprise du développement après plusieurs mois de pause.
> Ce document sert de mémoire de travail entre les sessions Claude Chat / Claude Code.

---

## 1. Où on en est, en une phrase

Le site a une base technique solide (checkout multi-étapes fonctionnel, la plupart des sections de la homepage codées), mais il reste des écarts entre le code actuel et les documents de fondation/produit/marque, et le flow d'activation côté destinataire (eBox) n'existe pas encore.

---

## 2. Décisions actées

| Sujet | Décision | Statut |
|---|---|---|
| Nombre de box au lancement | **Une seule box visible**, aucune autre teasée/grisée. Vision à moyen terme : 3 box au total. | ✅ Décidé — à répercuter dans le code (voir §5) |
| Backend transactionnel | Migration prévue de **Google Apps Script/Sheets → Supabase** (Postgres) pour ventes, codes d'activation, statuts | ✅ Décidé — **reporté à une phase ultérieure**, après validation contenu + design |
| Comptes acheteur | Prévus "un jour", pas au lancement | ✅ Confirmé — pèse en faveur de Supabase (Auth intégrée) plutôt que Neon |
| Ordre de travail | 1. Architecture/contenu de chaque page → 2. Design/visuel → 3. Connexion Supabase | ✅ Décidé |
| Sheets pour le catalogue | Rester sur Google Sheets pour le catalogue d'expériences (lecture), migrer uniquement le cœur transactionnel | 🟡 Proposé, pas encore confirmé par l'utilisateur |

---

## 3. Architecture technique (extrait arborescence `src/`)

**Stack** : Next.js (App Router) + TypeScript + Tailwind, backend actuel via Google Apps Script (`APPS_SCRIPT_URL`).

### Ce qui est construit et semble avancé
- Tunnel de checkout complet : `checkout/[slug]/page.tsx`, `.../pago/page.tsx`, `success/page.tsx`
- Routes API : `api/venta`, `api/checkout/start`, `api/checkout/pay`, `api/checkout/complete`
- Page produit dynamique `cajas/[slug]/page.tsx` avec sections dédiées (`BoxHero`, `BoxIncludes`, `BoxGiftMoment`, `BoxOccasions`)
- Page `empresas` très développée (7 sections : Hero, Problem, Solution, HowItWorks, UseCases, Options, Contact, FinalCTA) — plus riche que ce que prévoyait `03_website.md`
- Page `nuestra-historia` avec 6 sections narratives (non prévue dans les docs d'origine)
- Homepage : Hero, BenefitsBar, Boxes, HowItWorks, ExperiencesPreview, Occasions, Testimonials, FAQ, FinalCTA

### Ce qui manque ou est incomplet
- `app/ebox/` existe mais **vide** — aucune page pour l'activation destinataire
- `features/ebox/hooks/useEBoxFlow.ts` : logique commencée, sans UI associée
- `features/cart` et `features/vivabox` : dossiers vides
- Pas de pages dédiées FAQ / Contact / Privacy Policy / Terms & Conditions (seulement une section FAQ sur la home)
- Pas de page Aliados/Providers (prévue dans `03_website.md`, lien discret footer "Ofrecer una experiencia")
- Section `WhyVivabox.tsx` existe en code mais **n'est importée nulle part** dans `page.tsx` — section manquante à l'écran malgré son rôle central dans `03_website.md`
- `Moments.tsx` et `Companies.tsx` existent en composants mais non utilisés dans la homepage actuelle — à clarifier (à réintégrer ou à supprimer)

---

## 4. Audit sécurité/fiabilité du checkout (fait le [session précédente])

Fichiers revus : `api/venta/route.ts`, `api/checkout/start/route.ts`, `api/checkout/pay/route.ts`, `api/checkout/complete/route.ts`

**Point critique** : la route `pay` transmet tout le body reçu du client vers Apps Script sans aucune vérification serveur qu'un paiement réel a eu lieu (aucun processeur de paiement — Wompi/ePayco — visible dans ce fichier). À sécuriser avant tout lancement réel.

Autres points à corriger :
1. Toutes les routes renvoient un statut HTTP 200 même en cas d'erreur (`{ok: false}`) — empêche le monitoring automatique de détecter les erreurs.
2. Pas d'idempotence — un retry réseau pourrait créer une vente/des codes en double.
3. `console.log` de données sensibles (téléphone, email) dans plusieurs routes — à nettoyer avant prod.
4. Pas de secret partagé entre Next.js et le Apps Script — rien ne garantit que la requête vient bien du serveur.

**Cause racine** : ces risques sont amplifiés par l'usage de Google Sheets comme backend transactionnel (pas de vraies transactions, pas de verrou fiable en cas d'accès concurrent, latence) — d'où la décision de migrer vers Supabase (voir §2), une fois le contenu/design validés.

---

## 5. Audit de contenu — Homepage (en cours)

### `page.tsx`
- Ordre réel : Hero → BenefitsBar → Boxes → HowItWorks → ExperiencesPreview → Occasions → Testimonials → FAQ → FinalCTA
- `03_website.md` suggère "How it works" avant "the box" — actuellement inversé. À confirmer si voulu.
- **`WhyVivabox` non importée** — section de confiance centrale absente de la page actuelle.

### `Hero.tsx`
- Sous-titre *"Regalas la caja. La persona elige la experiencia."* → bien aligné avec le message central de marque.
- H1 *"Un regalo que no falla"* → reformulation du tagline officiel *"El regalo que siempre acierta"*, pas identique. À trancher : assumé ou à corriger ?
- 🔴 **Incohérence factuelle** : Hero affiche *"12 meses para usar"*, mais `02_product.md` fixe la validité à **6 mois**. À corriger dans un sens ou l'autre.
- *"+350 experiencias"* : chiffre à vérifier — figé ou réellement tenu à jour ? Risque de contredire la règle "les expériences sont des exemples, pas des garanties" si le nombre n'est plus exact.
- 🔴 **CTA "Ver las cajas" (pluriel) + section `#cajas`/`Boxes.tsx`** : contredit la décision d'une seule box visible au lancement. À reformuler en singulier une fois `Boxes.tsx` audité.

### `HowItWorks.tsx`
- Bonne synthèse en 3 étapes du cycle produit.
- Manque une mention explicite du **choix de l'expérience** (argument différenciant n°1) — actuellement seule la réservation de date est mentionnée.
- Couleurs en dur dans les classes Tailwind (`#1C1C1C`, `#FAFAF8`...) plutôt que via `styles/variables.css` — à corriger en phase design, pas bloquant pour le contenu.

### Restant à auditer
`Boxes.tsx`, `BenefitsBar.tsx`, `ExperiencesPreview.tsx`, `Occasions.tsx`, `Testimonials.tsx`, `FAQ.tsx`, `FinalCTA.tsx`, `WhyVivabox.tsx` (voir si à réintégrer), `Header.tsx`/`Navbar.tsx`, `Footer.tsx`

---

## 6. Questions ouvertes à trancher

1. Validité de la Vivabox : **6 mois** (doc) ou **12 mois** (code) ?
2. Le chiffre "+350 experiencias" est-il réel et à jour ?
3. Reformulation de "Ver las cajas" / `Boxes.tsx` en singulier — à faire maintenant ou après audit du composant ?
4. `WhyVivabox`, `Moments`, `Companies` : sections à réintégrer dans la homepage ou composants morts à supprimer ?
5. H1 du hero : garder "Un regalo que no falla" ou revenir au tagline officiel "El regalo que siempre acierta" ?
6. Confirmer : Google Sheets conservé uniquement pour le catalogue d'expériences (lecture) ?

---

## 7. Plan de travail (phases)

**Phase 1 — Architecture & contenu (en cours)**
1. Auditer chaque page existante vs docs de fondation/produit/site *(Homepage en cours)*
2. Définir le scope MVP des pages manquantes (FAQ, Contact, Privacy, Terms, Aliados)
3. Valider le parcours acheteur de bout en bout (Home → Cajas → Checkout → Success)
4. Finaliser les textes réels de chaque section

**Phase 2 — Design & visuel**
5. Auditer la cohérence visuelle actuelle vs `colors.md` / `imagery.md`
6. Finaliser le design des sections existantes puis des pages manquantes

**Phase 3 — Backend (Claude Code)**
7. Schéma de tables Supabase (ventas, codigos_activacion, beneficiarios, cajas — avec `buyer_id` prêt pour comptes acheteur futurs)
8. Sécuriser le paiement (Wompi/ePayco)
9. Migrer les routes `start`/`pay`/`complete` vers Supabase
10. Construire le flow eBox (activation + choix d'expérience côté destinataire)

---

## 8. Notes pour Claude Code (à utiliser plus tard)

- Connecteur MCP Supabase officiel disponible — permet de créer tables/migrations/types directement depuis le terminal.
- Prévoir un `CLAUDE.md` à la racine du repo reprenant l'essentiel de `01_project.md`, `04_brand.md`, `05_technical.md`, `AI_RULES.md` pour donner le contexte marque/produit à l'agent.
