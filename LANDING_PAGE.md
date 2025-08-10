# Structure de l'application PilotÉco

## Architecture des routes

L'application est maintenant structurée pour supporter la séparation entre la landing page et l'application :

### Routes publiques (Landing)

- `/` - Page d'accueil (landing page)
- `/mentions-legales` - Mentions légales
- `/politique-confidentialite` - Politique de confidentialité

### Routes de l'application

- `/app/login` - Connexion
- `/app/register` - Inscription
- `/app/dashboard` - Tableau de bord
- `/app/assessment-*` - Gestion des évaluations
- `/app/companies` - Gestion des entreprises

## Déploiement futur

Cette structure prépare le déploiement suivant :

- `/` → Landing page React
- `/app` → Application React SPA
- `/api` → Backend Symfony avec FrankenPHP

## Landing Page Features

✅ **Section Hero**

- Logo et nom PilotÉco
- Slogan accrocheur
- Bouton CTA vers l'application
- Design moderne avec gradient

✅ **Section Problème**

- Explication des enjeux environnementaux
- 3 points clés sur l'importance du bilan carbone

✅ **Section Solution**

- 3 étapes du processus PilotÉco
- Cards avec animations au survol
- Design numéroté et progressif

✅ **Section Call to Action**

- Bouton vers l'application
- Formulaire de contact newsletter
- Double proposition de valeur

✅ **Footer complet**

- Informations de contact
- Liens légaux fonctionnels
- Design professionnel

✅ **Pages légales**

- Mentions légales
- Politique de confidentialité
- Page 404 personnalisée

## Optimisations implémentées

- **Performance** : Lazy loading des composants
- **UX** : Animations et transitions fluides
- **SEO-ready** : Structure HTML sémantique
- **Mobile-first** : Design responsive
- **Accessibilité** : Contraste et navigation au clavier

## Prochaines étapes

1. **Contenu** : Finaliser les textes et ajouter de vraies images
2. **SEO** : Ajouter les meta tags et structured data
3. **Analytics** : Intégrer Google Analytics/Plausible
4. **Performance** : Optimiser les images et le chargement
5. **Tests** : A/B testing sur les CTA

## Technologies utilisées

- React 18 + TypeScript
- Material-UI v5
- React Router v6
- Vite (bundler)
- ESLint + Prettier
