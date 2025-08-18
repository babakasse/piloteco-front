// Utilitaire pour gérer les erreurs d'authentification

export const getAuthErrorMessage = (error: any, t: any): string => {
  // Si l'erreur a une réponse HTTP
  if (error?.response?.status) {
    switch (error.response.status) {
      case 401:
        // Vérifier si c'est spécifiquement "Invalid credentials"
        const message = error.response.data?.message || error?.message;
        if (message === "Invalid credentials.") {
          return t('login-error-credentials');
        }
        return t('login-error-invalid');
      case 409:
        return t('registration-error-email-exists');
      case 422:
        return error.response.data?.message || t('field-required');
      case 429:
        return 'Trop de tentatives. Veuillez attendre avant de réessayer.';
      case 500:
      case 502:
      case 503:
        return t('registration-error-network');
      default:
        // Utiliser le message du serveur s'il existe
        return error.response.data?.message || error.message || t('login-error');
    }
  }
  
  // Si l'erreur a un code direct (comme votre cas avec code: 401)
  if (error?.code === 401) {
    if (error?.message === "Invalid credentials.") {
      return t('login-error-credentials');
    }
    return t('login-error-invalid');
  }
  
  // Si l'erreur est une erreur réseau
  if (error?.code === 'NETWORK_ERROR' || error?.name === 'NetworkError') {
    return t('registration-error-network');
  }
  
  // Message d'erreur personnalisé ou générique
  return error?.message || t('login-error');
};

export const getLoginErrorMessage = (error: any, t: any): string => {
  // Utiliser directement la fonction principale qui gère tous les cas
  return getAuthErrorMessage(error, t);
};

export const getRegistrationErrorMessage = (error: any, t: any): string => {
  if (error?.response?.status === 409) {
    return t('registration-error-email-exists');
  }
  return getAuthErrorMessage(error, t);
};
