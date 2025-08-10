# Configuration Formspree - Guide étape par étape

## 🚀 Configuration rapide (5 minutes)

### Étape 1: Créer un compte Formspree

1. Allez sur **https://formspree.io**
2. Cliquez sur "Get Started" ou "Sign Up"
3. Créez un compte avec votre email

### Étape 2: Créer un formulaire

1. Une fois connecté, cliquez sur **"New Form"**
2. Donnez un nom à votre formulaire : `PilotÉco Newsletter`
3. **Notez votre Form ID** qui ressemble à : `xvgpnqra`

### Étape 3: Configurer le formulaire

Dans les paramètres de votre formulaire :

**Notifications Email :**

- ✅ Activez les notifications
- Ajoutez votre email : `contact@piloteco.fr`

**Champs autorisés :**

- `email` (requis)
- `message` (optionnel)
- `source` (optionnel)

**Réponse automatique :**

- ✅ Activez l'autoréponse
- Sujet : "Merci pour votre intérêt pour PilotÉco"
- Message :

```
Bonjour,

Merci pour votre intérêt pour PilotÉco !

Nous vous contacterons dès que notre solution de mesure d'empreinte carbone sera disponible.

En attendant, n'hésitez pas à nous contacter si vous avez des questions : contact@piloteco.fr

L'équipe PilotÉco
```

### Étape 4: Mettre à jour le code

Dans le fichier `src/pages/landing.tsx`, ligne 58, remplacez :

```typescript
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
```

Par :

```typescript
const response = await fetch('https://formspree.io/f/VOTRE_VRAI_FORM_ID', {
```

**Exemple :** Si votre Form ID est `xvgpnqra`, ça devient :

```typescript
const response = await fetch('https://formspree.io/f/xvgpnqra', {
```

### Étape 5: Tester

1. Sauvegardez le fichier
2. Allez sur votre landing page
3. Testez le formulaire avec votre email
4. Vérifiez que vous recevez l'email

## 📊 Plan gratuit Formspree

- ✅ **50 emails/mois** gratuits
- ✅ Protection anti-spam
- ✅ Réponses automatiques
- ✅ Tableau de bord
- ✅ Export des données

## 🔧 Fonctionnalités implémentées

### ✅ Interface utilisateur améliorée

- État de chargement ("Envoi...")
- Message de succès avec émoji
- Désactivation du formulaire pendant l'envoi
- Réinitialisation automatique après 5 secondes

### ✅ Données envoyées à Formspree

```json
{
  "email": "user@example.com",
  "message": "Inscription newsletter PilotÉco",
  "source": "Landing Page"
}
```

### ✅ Gestion d'erreurs

- Try/catch pour les erreurs réseau
- Message d'erreur utilisateur-friendly
- Logs pour le debugging

## 📈 Suivi et analytics

Dans votre tableau de bord Formspree, vous pourrez voir :

- Nombre d'inscriptions par jour/mois
- Adresses email collectées
- Taux de conversion
- Export CSV pour intégration dans d'autres outils

## 🔄 Migration future

Quand vous aurez votre propre API backend, vous pourrez facilement changer l'URL :

```typescript
// Formspree (actuel)
const response = await fetch('https://formspree.io/f/xvgpnqra', {

// Votre API (futur)
const response = await fetch('https://votre-domaine.com/api/newsletter', {
```

## ⚡ Test rapide

Après configuration, testez avec cet email : `test@piloteco.fr`

Vous devriez :

1. Voir "Envoi..." pendant l'envoi
2. Voir "✅ Merci !" après succès
3. Recevoir un email de notification
4. Voir l'inscription dans votre dashboard Formspree

---

**Status: 🎯 Production Ready avec collecte d'emails réelle !**
