# Guide de déploiement PilotÉco

## Structure finale

```
domain.com/
├── /              → Landing page (cette application React)
├── /app/          → Application PilotÉco (cette application React)
└── /api/          → Backend Symfony (FrankenPHP)
```

## Étapes de déploiement

### 1. Build de l'application

```bash
npm run build
```

### 2. Configuration du serveur web

#### Nginx (recommandé)

```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    root /var/www/piloteco-front/dist;

    # Landing page (routes React)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Application routes (préfixées /app)
    location /app {
        try_files $uri $uri/ /index.html;
    }

    # Backend API (à configurer séparément)
    location /api {
        proxy_pass http://localhost:8000;  # Port FrankenPHP
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Assets statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Apache (.htaccess)

```apache
RewriteEngine On

# API redirection
RewriteRule ^api/(.*)$ http://localhost:8000/$1 [P,L]

# SPA routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### 3. Variables d'environnement

Créez un fichier `.env.production` :

```env
VITE_APP_BASE_NAME=/
VITE_API_URL=https://votre-domaine.com/api
VITE_APP_VERSION=1.0.0
```

### 4. Build optimisé

```bash
# Installation des dépendances
npm ci --only=production

# Build avec optimisations
npm run build

# Vérification du build
npm run preview
```

### 5. Tests avant déploiement

- [ ] Landing page accessible sur `/`
- [ ] Application accessible sur `/app/login`
- [ ] Pages légales accessibles
- [ ] Redirections fonctionnelles
- [ ] Performance (Lighthouse score > 90)
- [ ] Mobile responsive
- [ ] Formulaires de contact fonctionnels

## Monitoring

### Métriques à surveiller

- **Performance** : Core Web Vitals
- **Erreurs** : 404, erreurs JavaScript
- **Conversions** : Clics sur "Essayer gratuitement"
- **SEO** : Positions sur "bilan carbone PME"

### Outils recommandés

- **Analytics** : Google Analytics 4 ou Plausible
- **Monitoring** : Sentry pour les erreurs
- **Performance** : Google PageSpeed Insights
- **Uptime** : Pingdom ou UptimeRobot

## Maintenance

### Mises à jour régulières

```bash
# Mise à jour des dépendances
npm audit
npm update

# Rebuild
npm run build
```

### Sauvegarde

- Code source : Git repository
- Configuration serveur
- Base de données (backend)

## Sécurité

- [ ] HTTPS activé (Let's Encrypt)
- [ ] Headers de sécurité (CSP, HSTS)
- [ ] Protection contre le spam (formulaires)
- [ ] Rate limiting sur l'API
- [ ] Logs des accès
