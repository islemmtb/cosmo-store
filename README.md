# Cosmo Grossiste — Guide de déploiement complet

Application e-commerce wholesale cosmétiques, construite avec **Next.js 14**, **Supabase** et déployée sur **Vercel**.

---

## Architecture

```
cosmo-store/
├── src/
│   ├── app/
│   │   ├── page.tsx              → Page d'accueil
│   │   ├── catalogue/page.tsx    → Catalogue complet
│   │   ├── contact/page.tsx      → Contact & livraison
│   │   ├── [slug]/page.tsx       → Page produit dynamique (ex: /creme-loreal)
│   │   ├── admin/
│   │   │   ├── page.tsx          → Login admin
│   │   │   └── dashboard/
│   │   │       ├── page.tsx      → Tableau de bord
│   │   │       ├── products/     → Gestion produits
│   │   │       ├── orders/       → Gestion commandes
│   │   │       └── import/       → Import Excel
│   │   └── api/
│   │       ├── orders/           → POST commandes + WhatsApp
│   │       └── admin/
│   │           ├── products/     → CRUD produits
│   │           ├── orders/       → Gestion commandes
│   │           └── upload/       → Upload images
│   ├── components/               → Composants réutilisables
│   ├── hooks/useCart.tsx          → Panier (Context + localStorage)
│   └── lib/supabase.ts           → Client Supabase + types
├── supabase-schema.sql           → Script SQL à exécuter dans Supabase
└── .env.local.example            → Variables d'environnement à configurer
```

---

## ÉTAPE 1 — Installer Git et Node.js

### Windows
1. Téléchargez **Git** : https://git-scm.com/download/win → Installer avec les options par défaut
2. Téléchargez **Node.js** v20 LTS : https://nodejs.org → Installer
3. Vérifiez : ouvrez **PowerShell** et tapez :
   ```bash
   git --version
   node --version
   npm --version
   ```

### Mac
```bash
# Installez Homebrew si pas encore fait
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# Installez Git et Node
brew install git node
```

---

## ÉTAPE 2 — Créer un compte GitHub

1. Allez sur https://github.com → Sign up (gratuit)
2. Choisissez un nom d'utilisateur (ex: `cosmo-grossiste`)
3. Vérifiez votre email

---

## ÉTAPE 3 — Créer le dépôt GitHub

1. Connectez-vous à GitHub → Cliquez sur **"New repository"** (bouton vert)
2. Nom du dépôt : `cosmo-store`
3. Laissez en **Public** (gratuit pour Vercel)
4. **Ne cochez PAS** "Add README" (on en a déjà un)
5. Cliquez **"Create repository"**

---

## ÉTAPE 4 — Pousser le code sur GitHub

Ouvrez un terminal (PowerShell sur Windows, Terminal sur Mac) dans le dossier du projet :

```bash
# Entrez dans le dossier du projet
cd cosmo-store

# Initialisez Git
git init

# Ajoutez tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - Cosmo Grossiste"

# Connectez au dépôt GitHub (remplacez VOTRE_USERNAME par votre nom d'utilisateur GitHub)
git remote add origin https://github.com/VOTRE_USERNAME/cosmo-store.git

# Poussez le code
git branch -M main
git push -u origin main
```

Si GitHub demande un identifiant → entrez votre email et mot de passe GitHub (ou token).

---

## ÉTAPE 5 — Configurer Supabase (Base de données)

1. Allez sur https://supabase.com → **Start for free**
2. Créez un compte (avec GitHub, c'est plus simple)
3. Cliquez **"New project"**
   - Nom : `cosmo-store`
   - Mot de passe BDD : choisissez un mot de passe fort (notez-le !)
   - Région : choisissez **West EU (Ireland)** (plus proche de l'Algérie)
4. Attendez ~2 minutes que le projet se crée

### Exécuter le schéma SQL

1. Dans le dashboard Supabase → cliquez **"SQL Editor"** (icône `< >` dans le menu gauche)
2. Cliquez **"New query"**
3. Copiez-collez tout le contenu du fichier `supabase-schema.sql`
4. Cliquez **"Run"** → Vous devriez voir "Success"

### Récupérer vos clés API

1. Dans Supabase → **Settings** (icône engrenage) → **API**
2. Notez :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public key** : `eyJhbGci...` (longue chaîne)
   - **service_role key** : `eyJhbGci...` (**⚠️ GARDER SECRET !**)

---

## ÉTAPE 6 — Configurer WhatsApp (CallMeBot)

Pour recevoir des notifications WhatsApp automatiques :

1. Depuis votre WhatsApp (**+213 562 256 189**), envoyez ce message à ce numéro : **+34 644 60 49 57**
   ```
   I allow callmebot to send me messages
   ```
2. Vous recevrez en réponse votre **API Key** (ex: `1234567`)
3. Notez cette API Key

> ℹ️ Si ça ne fonctionne pas immédiatement, attendez quelques minutes et réessayez.

---

## ÉTAPE 7 — Déployer sur Vercel

1. Allez sur https://vercel.com → **Sign up with GitHub**
2. Cliquez **"New Project"**
3. Cliquez **"Import"** à côté de `cosmo-store`
4. **Framework Preset** → Next.js (détecté automatiquement)
5. Cliquez **"Environment Variables"** → Ajoutez ces variables une par une :

| Nom | Valeur |
|-----|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` (anon key) |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` (service_role key) |
| `ADMIN_PASSWORD` | Un mot de passe fort de votre choix |
| `WHATSAPP_API_KEY` | Votre clé CallMeBot |
| `WHATSAPP_PHONE` | `+213562256189` |

6. Cliquez **"Deploy"** → Attendez ~3 minutes

✅ Votre site est en ligne ! Vercel vous donnera une URL comme `cosmo-store.vercel.app`

---

## ÉTAPE 8 — Configurer un domaine personnalisé (optionnel)

1. Dans Vercel → votre projet → **Settings** → **Domains**
2. Entrez votre domaine (ex: `cosmo-grossiste.dz`)
3. Suivez les instructions pour configurer les DNS chez votre registrar

---

## Utilisation quotidienne

### Accéder au panneau admin
- URL : `votresite.com/admin`
- Mot de passe : celui défini dans `ADMIN_PASSWORD`

### Ajouter un produit manuellement
1. Admin → **Produits** → **Nouveau produit**
2. Remplissez le nom (l'URL se génère automatiquement)
3. Ajoutez les prix, stock, images
4. **Créer le produit** → visible immédiatement sur le site

### Importer depuis Excel
1. Admin → **Import Excel**
2. Glissez votre fichier `.xlsx`
3. Vérifiez/modifiez les données
4. Sélectionnez les produits à importer
5. Cliquez **Importer**

### Colonnes Excel reconnues
| Colonne | Description |
|---------|-------------|
| `nom` ou `name` | Nom du produit (**obligatoire**) |
| `prix_unite` ou `prix` | Prix par unité en DZD |
| `prix_boite` | Prix par boîte en DZD |
| `stock` | Quantité en stock |
| `marque` | Marque du produit |
| `categorie` | Catégorie |
| `unites_boite` | Nombre d'unités par boîte |
| `min_commande` | Commande minimum |
| `description` | Description |
| `vedette` | `oui` / `non` |
| `actif` | `oui` / `non` |

### Gérer les commandes
1. Admin → **Commandes**
2. Cliquez sur une commande pour voir les détails
3. Changez le statut : En attente → Confirmée → Livrée
4. Bouton "Contacter le client" ouvre WhatsApp directement

---

## Mettre à jour le site après modifications

```bash
# Dans le dossier cosmo-store
git add .
git commit -m "Description de vos modifications"
git push
```

Vercel redéploie automatiquement en ~1 minute ! ✨

---

## Dépannage fréquent

**Le site affiche une erreur 500**
→ Vérifiez les variables d'environnement dans Vercel → Settings → Environment Variables

**WhatsApp ne reçoit pas de messages**
→ Vérifiez que vous avez bien envoyé le message à CallMeBot et que l'API Key est correcte

**Images non affichées**
→ Vérifiez que le bucket `product-images` est bien créé dans Supabase Storage et qu'il est public

**Produits non visibles**
→ Dans le dashboard admin, vérifiez que les produits sont bien marqués comme "Actif"

**Erreur lors du login admin**
→ Vérifiez que `ADMIN_PASSWORD` est bien défini dans Vercel et qu'il correspond au mot de passe entré
