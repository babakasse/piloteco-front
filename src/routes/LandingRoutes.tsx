import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';

const LandingPage = Loadable(lazy(() => import('pages/landing')));
const MentionsLegales = Loadable(lazy(() => import('pages/mentions-legales')));
const PolitiqueConfidentialite = Loadable(lazy(() => import('pages/politique-confidentialite')));
const NotFound = Loadable(lazy(() => import('pages/not-found')));

// ==============================|| LANDING ROUTES ||============================== //

const LandingRoutes = {
  path: '/',
  children: [
    {
      path: '',
      element: <LandingPage />
    },
    {
      path: 'mentions-legales',
      element: <MentionsLegales />
    },
    {
      path: 'politique-confidentialite',
      element: <PolitiqueConfidentialite />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ]
};

export default LandingRoutes;
