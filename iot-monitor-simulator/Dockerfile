# Imagen base de Node.js
FROM node:20-alpine

# Directorio de trabajo
WORKDIR usr/src/app

# Copia los archivos de dependecias
COPY package.json yarn.lock ./

# Instalamos las dependecias con yarn
RUN yarn --frozen-lockfile

# Copiamos el resto de los archivos
COPY . .

# Exponemos el puerto que usa el backend
EXPOSE 3000

# Comando por defecto para iniciar el backend
CMD ["yarn", "start:dev"]

