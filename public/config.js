// Default configuration for development
// This file will be overridden by Docker at runtime

window.ENV = {
  // URL du backend PHP en production
  VITE_APP_API_URL: "https://piloteco-back.azurewebsites.net",

  // Base path du front (utile si l'app est servie depuis un sous-chemin)
  VITE_APP_BASE_NAME: "/",

  // Version de l'application
  VITE_APP_VERSION: "v9.2.0"
};
