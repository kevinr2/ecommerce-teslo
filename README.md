# Ecommerce-teslo

## tienda virtual 



## Pasos en dev

1. Clonar el respositorio.
2. Crear una copia del ```.env.template``` y renombarlo a  ```.env``` y cambiar las variables de entorno.
3. Instalar dependencias ```npm install```.
4. Levantar la base de datos ```docker compose up -d ```.
5. Correr la migracion de PRISMA ```npx prisma migrate dev```.
6. Ejecutar seed ```npm run seed```.
7. correr el proyecto ```npm run dev```.