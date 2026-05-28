# HR WEAR — Guide de démarrage

## 1. Installer les dépendances

```bash
cd "HR WEAR"
npm install
```

## 2. Créer votre projet Supabase

1. Allez sur [supabase.com](https://supabase.com) et créez un compte gratuit
2. Créez un nouveau projet (choisissez une région Europe)
3. Dans **SQL Editor**, copiez-collez le contenu du fichier `supabase/schema.sql` et exécutez-le
4. Dans **Project Settings > API**, copiez :
   - **Project URL**
   - **anon public key**

## 3. Configurer les variables d'environnement

```bash
cp .env.local.example .env.local
```

Éditez `.env.local` et remplissez vos clés Supabase.

## 4. Créer le compte gérant

Dans Supabase > **Authentication > Users** :
- Cliquez "Invite user"
- Entrez l'email du gérant HR WEAR
- Il recevra un email pour définir son mot de passe

## 5. Lancer le site en local

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

- **Boutique** : http://localhost:3000
- **Admin** : http://localhost:3000/admin/login

---

## 6. Déploiement GitHub Pages

```bash
# Initialiser le repo Git
git init
git add .
git commit -m "Initial commit — HR WEAR"

# Créer un repo GitHub nommé "hrwear" ou "hrwear-site"
# puis :
git remote add origin https://github.com/VOTRE_USERNAME/hrwear-site.git
git push -u origin main
```

Dans GitHub > Settings > Pages :
- Source : **GitHub Actions**
- Le fichier `.github/workflows/deploy.yml` s'occupe du build automatique

## 7. Domaine Hostinger

Dans Hostinger > DNS :
- Ajoutez un enregistrement **CNAME** pointant vers `VOTRE_USERNAME.github.io`
- Dans GitHub Pages, configurez votre domaine personnalisé

---

## Structure du projet

```
src/
├── app/
│   ├── page.tsx              ← Accueil
│   ├── catalogue/            ← Catalogue produits
│   ├── produit/[slug]/       ← Fiche produit
│   ├── commande/             ← Formulaire de commande
│   ├── confirmation/[id]/    ← Confirmation commande
│   ├── livraison/            ← Tarifs livraison
│   └── admin/                ← Dashboard gérant
│       ├── commandes/        ← Gestion commandes
│       ├── produits/         ← Gestion produits
│       └── stock/            ← Gestion stock
├── components/               ← Composants réutilisables
├── context/CartContext.tsx   ← Panier (localStorage)
└── lib/
    ├── wilayas.ts            ← Grille tarifaire TawssilGo
    ├── types.ts              ← Types TypeScript
    └── supabase/client.ts    ← Client Supabase
```
