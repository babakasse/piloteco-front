# Guide Rapide - Système de Traduction PilotEco

## 🚀 Démarrage Rapide

### 1. Utiliser les traductions dans un composant

```typescript
import { useLanguage } from 'contexts/LanguageContext';

const MonComposant = () => {
  const { t } = useLanguage();

  return (
    <div>
      <h1>{t('dashboard')}</h1>
      <p>{t('total-emissions')}: 1,250 {t('co2-eq')}</p>
    </div>
  );
};
```

### 2. Changer la langue

```typescript
const { language, setLanguage } = useLanguage();

// Basculer entre français et anglais
const toggleLanguage = () => {
  setLanguage(language === 'fr' ? 'en' : 'fr');
};
```

### 3. Ajouter une nouvelle traduction

**Étape 1**: Ajouter dans `src/locales/fr.ts`

```typescript
export const fr = {
  // ... autres traductions
  'ma-nouvelle-cle': 'Ma nouvelle traduction'
};
```

**Étape 2**: Ajouter dans `src/locales/en.ts`

```typescript
export const en = {
  // ... autres traductions
  'ma-nouvelle-cle': 'My new translation'
};
```

**Étape 3**: Utiliser dans le composant

```typescript
<Typography>{t('ma-nouvelle-cle')}</Typography>
```

## 📋 Clés Disponibles

### Navigation

- `dashboard`, `assessments`, `companies`, `reports`
- `settings`, `profile`, `logout`, `help`, `support`

### Actions

- `save`, `cancel`, `delete`, `edit`, `add`, `create`
- `update`, `submit`, `next`, `previous`, `back`

### Authentification

- `login`, `register`, `sign-in`, `sign-up`
- `forgot-password`, `email`, `password`

### Messages

- `welcome`, `loading`, `error`, `success`, `warning`
- `no-data`, `confirm-delete`, `unsaved-changes`

### Carbone

- `carbon-assessment`, `carbon-footprint`, `scope-1`, `scope-2`, `scope-3`
- `total-emissions`, `emission-factor`, `co2-equivalent`

## 🔧 Composants Traduits

✅ **Header**

- Notifications
- Messages/Annonces
- Profile
- Language Selector

✅ **Navigation**

- Menu utilisateur
- Menu principal
- Menus items

✅ **Authentification**

- Pages login/register
- Boutons sociaux

✅ **Dashboard**

- Messages d'accueil
- Métriques principales

## 💡 Bonnes Pratiques

### Conventions de nommage

- Utilisez des tirets (`-`) pour séparer les mots
- Soyez descriptifs : `carbon-assessment` plutôt que `assessment`
- Groupez par contexte : `auth-login`, `dashboard-welcome`

### Paramètres dynamiques

```typescript
// Dans le dictionnaire
'welcome-user': 'Bienvenue {firstName} {lastName} !'

// Dans le composant
const message = t('welcome-user', {
  firstName: 'John',
  lastName: 'Doe'
});
```

### Gestion du pluriel

```typescript
// Simple
'items-count': 'Vous avez {count} élément(s)'

// Avancé (si nécessaire)
'items-count-zero': 'Aucun élément'
'items-count-one': 'Un élément'
'items-count-many': '{count} éléments'
```

## 🎯 Prochaines Étapes pour Finaliser

1. **Formulaires d'authentification** - Traduire tous les champs et messages d'erreur
2. **Pages d'évaluation** - Traduire les formulaires de création/édition
3. **Messages d'erreur** - Centraliser tous les messages de validation
4. **Tableaux** - Traduire les en-têtes et actions des tableaux
5. **Modales** - Traduire les dialogues de confirmation

## 🚨 Points d'Attention

- **Performance** : Les traductions sont chargées au démarrage, pas de lazy loading
- **Cache** : La langue est persistée dans localStorage
- **Fallback** : Si une clé n'existe pas en anglais, le français est utilisé
- **TypeScript** : Toutes les clés sont typées pour éviter les erreurs

## 📱 Test Rapide

1. Lancez l'application
2. Cliquez sur l'icône globe (🌐) dans le header
3. Basculez entre FR/EN
4. Vérifiez que les textes changent automatiquement

Le système est maintenant opérationnel et prêt pour l'internationalisation complète de PilotEco ! 🎉
