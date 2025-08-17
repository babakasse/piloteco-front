// Utilitaire de test pour les erreurs d'authentification
// Ce fichier peut être supprimé en production

export const mockAuthErrors = {
  invalidCredentials: {
    response: {
      status: 401,
      data: {
        code: 401,
        message: "Invalid credentials."
      }
    }
  },
  
  emailExists: {
    response: {
      status: 409,
      data: {
        code: 409,
        message: "Email already exists."
      }
    }
  },
  
  networkError: {
    code: 'NETWORK_ERROR',
    name: 'NetworkError',
    message: 'Network Error'
  },
  
  serverError: {
    response: {
      status: 500,
      data: {
        code: 500,
        message: "Internal Server Error"
      }
    }
  }
};

// Fonction de test pour vérifier les messages d'erreur
export const testAuthErrorMessages = (t: any) => {
  const { getAuthErrorMessage } = require('./auth-errors');
  
  console.log('=== Test des messages d\'erreur d\'authentification ===');
  
  // Test invalid credentials
  const invalidCredsMsg = getAuthErrorMessage(mockAuthErrors.invalidCredentials, t);
  console.log('Invalid credentials:', invalidCredsMsg);
  
  // Test email exists
  const emailExistsMsg = getAuthErrorMessage(mockAuthErrors.emailExists, t);
  console.log('Email exists:', emailExistsMsg);
  
  // Test network error
  const networkErrorMsg = getAuthErrorMessage(mockAuthErrors.networkError, t);
  console.log('Network error:', networkErrorMsg);
  
  // Test server error
  const serverErrorMsg = getAuthErrorMessage(mockAuthErrors.serverError, t);
  console.log('Server error:', serverErrorMsg);
  
  console.log('=== Fin des tests ===');
};
