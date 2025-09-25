# Usa una imagen base de Node.js ligera y segura
FROM node:22-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias e instálalas primero
COPY package*.json ./
RUN npm install

# Copia el resto del código de tu aplicación
COPY . .

# Expone el puerto que definiste para este servicio (3000)
EXPOSE 3000

# El comando para iniciar tu servidor
CMD ["npm", "start"]