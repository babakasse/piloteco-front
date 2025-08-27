import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// project-imports
import useAuth from 'hooks/useAuth';
import Loader from 'components/Loader';

// types
import { GuardProps } from 'types/auth';

// ==============================|| AUTH GUARD ||============================== //

export default function AuthGuard({ children }: GuardProps) {
  const { isLoggedIn, isInitialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Attendre que l'initialisation soit terminée
    if (isInitialized && !isLoggedIn) {
      // Éviter la redirection si on est déjà sur une page de login
      if (!location.pathname.includes('/login') && 
          !location.pathname.includes('/register') && 
          !location.pathname.includes('/forgot-password') &&
          !location.pathname.includes('/check-mail') &&
          !location.pathname.includes('/reset-password') &&
          !location.pathname.includes('/code-verification')) {
        navigate('/login', {
          state: {
            from: location.pathname
          },
          replace: true
        });
      }
    }
  }, [isLoggedIn, isInitialized, navigate, location]);

  // Afficher un loader pendant l'initialisation
  if (!isInitialized) {
    return <Loader />;
  }

  // Si l'utilisateur n'est pas connecté, ne pas afficher le contenu
  if (!isLoggedIn) {
    return null;
  }

  return children;
}
