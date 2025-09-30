# Etapa 1: Build de Angular
FROM node:20-alpine as build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production --output-path=dist/iot-monitor-web --base-href=/

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Eliminamos configuración por defecto
RUN rm /etc/nginx/conf.d/default.conf

# Copiamos archivos de Angular
COPY --from=build /usr/src/app/dist/iot-monitor-web /usr/share/nginx/html

# Configuración de Nginx para SPA
RUN echo $'server {\n\
    listen 4200;\n\
    server_name localhost;\n\
    root /usr/share/nginx/html/browser;\n\
    index index.html;\n\
\n\
    location / {\n\
        try_files $uri /index.html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
