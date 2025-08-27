# Système de Traduction PilotEco

## Vue d'ensemble

Ce projet utilise un système de traduction personnalisé qui permet de basculer entre le français et l'anglais. Le système est basé sur React Context et fournit une interface simple pour traduire tout le contenu de l'application.

## Structure

```
src/
├── locales/
│   ├── fr.ts          # Dictionnaire français
│   ├── en.ts          # Dictionnaire anglais
│   └── index.ts       # Export des traductions
├── contexts/
│   └── LanguageContext.tsx  # Contexte de langue
└── components/
    └── LanguageSelector.tsx  # Sélecteur de langue
```

## Utilisation

### 1. Hook useLanguage

```typescript
import { useLanguage } from 'contexts/LanguageContext';

const MyComponent = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button onClick={() => setLanguage('en')}>English</button>
      <button onClick={() => setLanguage('fr')}>Français</button>
    </div>
  );
};
```

### 2. Fonction de traduction avec paramètres

```typescript
// Dans le dictionnaire
const fr = {
  'welcome-user': 'Bienvenue {name}!',
  'items-count': 'Vous avez {count} élément(s)'
};

// Dans le composant
const message = t('welcome-user', { name: 'John' });
const count = t('items-count', { count: 5 });
```

### 3. Sélecteur de langue

Le composant `LanguageSelector` est déjà intégré dans le header de l'application et permet aux utilisateurs de changer de langue.

## Dictionnaires de traduction

### Structure des clés

Les clés de traduction suivent une convention de nommage claire :

- **Navigation** : `dashboard`, `profile`, `settings`
- **Actions** : `save`, `cancel`, `delete`, `edit`
- **Messages** : `welcome`, `loading`, `error`, `success`
- **Formulaires** : `email`, `password`, `first-name`
- **Notifications** : `notifications`, `new-feature`, `improvement`

### Ajout de nouvelles traductions

1. Ajoutez la clé dans `src/locales/fr.ts`
2. Ajoutez la traduction correspondante dans `src/locales/en.ts`
3. Utilisez la clé avec `t('votre-cle')` dans vos composants

## Composants traduits

Les composants suivants ont été traduits :

- ✅ **Header/Notification** : Toutes les notifications et messages
- ✅ **Header/Message** : Annonces PilotEco
- ✅ **Header/Profile** : Menu profil utilisateur
- ✅ **Drawer/NavUser** : Menu utilisateur dans le tiroir
- ✅ **LanguageSelector** : Sélecteur de langue

## Fonctionnalités

- **Persistance** : La langue sélectionnée est sauvegardée dans localStorage
- **Fallback** : Si une traduction n'existe pas en anglais, le français est utilisé
- **Paramètres** : Support des variables dans les traductions
- **TypeScript** : Types complets pour toutes les clés de traduction

## Configuration

La langue par défaut est le français. Pour changer cela, modifiez la valeur par défaut dans `LanguageContext.tsx` :

```typescript
const [language, setLanguage] = useState<SupportedLanguages>(() => {
  const savedLanguage = localStorage.getItem('piloteco-language');
  return (savedLanguage as SupportedLanguages) || 'fr'; // Changez 'fr' en 'en' pour l'anglais par défaut
});
```

## Prochaines étapes

Pour compléter la traduction de l'application :

1. **Pages** : Traduire les pages dashboard, contact-us, assessments, etc.
2. **Formulaires** : Traduire tous les formulaires d'authentification
3. **Menus** : Traduire les éléments de menu
4. **Messages d'erreur** : Traduire tous les messages de validation
5. **Coming Soon page** : Finaliser la traduction de la page de maintenance

## Exemple d'utilisation complète

```typescript
import { useLanguage } from 'contexts/LanguageContext';

const Dashboard = () => {
  const { t } = useLanguage();

  return (
    <div>
      <h1>{t('dashboard')}</h1>
      <p>{t('total-emissions')}: 1,250 {t('co2-eq')}</p>
      <button>{t('create')} {t('carbon-assessment')}</button>
    </div>
  );
};
```

Ce système offre une base solide pour une application multilingue avec une interface utilisateur cohérente et une expérience utilisateur optimale.
