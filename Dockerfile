#define imagen base
FROM node

# crea una carpeta donde se va a guardar el proyecto
WORKDIR /app

# copia el package local a carpeta de operaciones
COPY package*.json ./

# corre comando para instalar dependencias
RUN npm install

# copia el codigo de la aplicacion
COPY . .

# define puerto de escucha 
EXPOSE 8080

# ejecuta comando en terrminal
CMD [ "npm", "start"]