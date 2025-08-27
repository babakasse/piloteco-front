#!/bin/sh

# Docker entrypoint script for PilotEco Frontend
# This script injects environment variables into the built application

echo "Starting PilotEco Frontend container..."

# Create a config file with environment variables
cat <<EOF > /usr/share/nginx/html/config.js
window.ENV = {
  VITE_APP_API_URL: "${VITE_APP_API_URL:-http://localhost}",
  VITE_APP_BASE_NAME: "${VITE_APP_BASE_NAME:-}",
  VITE_APP_VERSION: "${VITE_APP_VERSION:-v9.2.0}"
};
EOF

echo "Environment configuration created:"
cat /usr/share/nginx/html/config.js

# Replace backend URL in nginx config if provided
if [ ! -z "$BACKEND_URL" ]; then
    echo "Configuring backend URL: $BACKEND_URL"
    sed -i "s|\${BACKEND_URL}|$BACKEND_URL|g" /etc/nginx/nginx.conf
else
    echo "No BACKEND_URL provided, using default configuration"
    sed -i "s|\${BACKEND_URL}|http://host.docker.internal|g" /etc/nginx/nginx.conf
fi

echo "Starting nginx..."
exec "$@"
