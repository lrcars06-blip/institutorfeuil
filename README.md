# L'Institut d'Orfeuil — site vitrine + cartes cadeaux en ligne

Institut de beauté · 2 Rue d'Orfeuil, 51000 Châlons-en-Champagne · 09 75 40 79 83

## Ce que fait le site

- Site vitrine complet dans `index.html` (photos en local, aucune dépendance externe hors polices Google).
- **Cartes cadeaux dématérialisées** : le client compose sa carte (montant ou soin, message, style), paie par Stripe, et
  1. le **bénéficiaire** reçoit la carte par e-mail avec un **code unique** (`ORF-XXXX-XXXX`) ;
  2. l'**acheteur** reçoit une copie / confirmation ;
  3. la **gérante** reçoit une alerte « Paiement reçu » avec tous les détails.
- **`admin.html`** (protégée par code PIN) : la gérante saisit le code d'une carte → voit sa validité, débite un montant ou valide le soin. Impossible d'utiliser une carte deux fois.

Les cartes sont enregistrées directement sur les paiements Stripe : pas de base de données à gérer.

## Structure

```
index.html          site
admin.html          espace institut (vérification / débit des cartes)
legal.html          redirection vers index.html#mentions (les mentions légales, CGV, données, cookies et le formulaire de rétractation sont intégrés à index.html : objet LEGAL à compléter dans son script)
fonts/              polices auto-hébergées pour admin.html (index.html les embarque en base64)
api/checkout.js     crée la page de paiement Stripe
api/webhook.js      après paiement : génère le code, envoie les 3 e-mails
api/verify.js       utilisé par admin.html
api/_lib.js         validation + modèles d'e-mails
api/_soins.js       prix des soins offrables (contrôle anti-fraude côté serveur)
package.json        dépendances (stripe, resend)
.env.example        liste des variables à renseigner dans Vercel
*.webp, og-image.jpg, favicon.svg, robots.txt
```

Le dossier `api/` doit rester un sous-dossier : c'est ce qui crée les fonctions serveur sur Vercel.

## Mise en service (≈ 45 min)

### 1. Stripe — encaisser (compte au nom de l'institut)
1. Créer le compte sur stripe.com avec le SIRET et l'IBAN de l'institut.
2. Développeurs → Clés API → copier la **clé secrète** (`sk_test_…` pour tester, `sk_live_…` en production).

### 2. Resend — envoyer les e-mails
1. Créer un compte sur resend.com.
2. Domains → Add domain → ajouter les enregistrements DNS indiqués chez le registrar du domaine → attendre « Verified ».
   Sans domaine vérifié, les e-mails ne partent pas vers les clients.
3. API Keys → créer une clé (`re_…`).

### 3. Vercel — variables d'environnement
Settings → Environment Variables, ajouter (voir `.env.example`) :

| Variable | Valeur |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_test_…` puis `sk_live_…` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` (étape 4) |
| `RESEND_API_KEY` | `re_…` |
| `MAIL_FROM` | `L'Institut d'Orfeuil <cadeaux@domaine-verifie.fr>` |
| `SHOP_EMAIL` | adresse de la gérante |
| `ADMIN_PIN` | code de l'espace institut (8 caractères ou plus) |
| `SITE_URL` | `https://domaine.fr` (sans `/` final) |

Puis Deployments → Redeploy.

### 4. Stripe — webhook
Développeurs → Webhooks → Ajouter une destination :
- URL : `https://domaine.fr/api/webhook`
- Événements : `checkout.session.completed` et `checkout.session.async_payment_succeeded`
- Copier le **secret de signature** (`whsec_…`) dans `STRIPE_WEBHOOK_SECRET`, puis Redeploy.

### 5. Tester (mode test)
1. Sur le site, composer une carte avec **votre** e-mail comme bénéficiaire → Payer.
2. Carte de test : `4242 4242 4242 4242`, date future, CVC `123`.
3. Attendu en moins d'une minute : 3 e-mails (bénéficiaire, acheteur, gérante).
4. Ouvrir `https://domaine.fr/admin.html`, saisir le PIN puis le code reçu → « Valide » → débiter → revérifier : « Déjà utilisée » ou nouveau solde.
5. En cas d'échec : Stripe → Webhooks → la destination → onglet des tentatives (code d'erreur), et Vercel → Logs.

### 6. Passer en réel
Remplacer `sk_test_` par `sk_live_`, recréer le webhook en mode live (nouveau `whsec_`), Redeploy, faire un achat réel de 20 € puis le rembourser depuis Stripe.

## Réglages courants

- **Prix d'un soin modifié** : le changer dans `CARTE` (index.html) **et** dans `api/_soins.js`. Si les deux diffèrent, le paiement de ce soin est refusé (sécurité).
- **Montants proposés, validité affichée** : objet `GIFT` en bas de `index.html`. Durée de validité réelle et montant min/max : `RULES` dans `api/_lib.js`.
- **Après branchement du domaine** : remplacer `og-image.jpg` par l'URL absolue dans la balise `og:image` d'`index.html`.
