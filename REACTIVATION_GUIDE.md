# Guide de réactivation de l'application

## État actuel

L'application PilotÉco est actuellement en mode "Coming Soon". Seules les pages suivantes sont accessibles :

- ✅ **`/`** - Landing page
- ✅ **`/mentions-legales`** - Mentions légales
- ✅ **`/politique-confidentialite`** - Politique de confidentialité
- 🚫 **`/app/*`** - Application (redirige vers "Bientôt disponible")

## Comment réactiver l'application

### 1. Restaurer le routing complet

Dans le fichier `src/routes/index.tsx`, remplacer :

```tsx
// Configuration actuelle (mode "Coming Soon")
{
  path: '/app',
  element: <LandingLayout><Outlet /></LandingLayout>,
  children: [
    {
      path: '*',
      element: <ComingSoon />
    }
  ]
}
```

Par :

```tsx
// Configuration complète (application active)
{
  path: '/app',
  children: [
    {
      path: '',
      element: <Navigate to="/app/login" replace />
    },
    LoginRoutes,
    MainRoutes
  ]
}
```

### 2. Ajouter les imports nécessaires

```tsx
import { Navigate } from 'react-router-dom';
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
```

### 3. Supprimer les imports temporaires

Retirer :

```tsx
import { lazy } from 'react';
import Loadable from 'components/Loadable';
import LandingLayout from 'layout/Landing';
import { Outlet } from 'react-router-dom';

const ComingSoon = Loadable(lazy(() => import('pages/coming-soon')));
```

### 4. Mettre à jour la landing page

Dans `src/config/landing.ts`, modifier :

```tsx
hero: {
  ctaText: 'Essayer gratuitement'  // Au lieu de 'Découvrir la solution'
},

cta: {
  title: 'Prêt à réduire votre empreinte carbone ?',
  subtitle: 'Commencez dès maintenant votre évaluation gratuite...',
  primaryButtonText: 'Commencer maintenant'
}
```

Dans `src/pages/landing.tsx`, modifier :

```tsx
const handleStartTrial = () => {
  navigate('/app/login'); // Au lieu de '/app'
};
```

## Pages créées pour le mode "Coming Soon"

- `src/pages/coming-soon.tsx` - Page "Bientôt disponible" avec formulaire d'inscription
- Cette page peut être supprimée ou conservée pour de futurs lancements

## Avantages du mode actuel

- ✅ Collecte d'emails pour la liste d'attente
- ✅ Présentation professionnelle du projet
- ✅ SEO optimisé pour le référencement
- ✅ Pages légales complètes
- ✅ Pas d'accès prématuré à l'application

## Tests à effectuer après réactivation

- [ ] Connexion/Inscription fonctionnelle
- [ ] Navigation dans l'application
- [ ] Toutes les fonctionnalités métier
- [ ] Redirections correctes
- [ ] Performance générale
