<h1><em> Tienda Virtual </em></h1>

:construction: Proyecto en construcción :construction:

<h2>Iniciar Aplicación</h2>
La aplicación se inicia con comando npm run dev para iniciar en modo desarrolló o npm start para modo producción.
Por defecto la aplicación se pone en escucha del puerto 8080, en caso de quiere utilizar un puerto distinto se debe agregar -p con el puerto deseado al comando de inicio.

El almacenamiento por defecto se inicia con una conexión a mongo Atlas, en caso de querer utilizar un método distinto se debe agregar la opción --store <b>[MONGO, FILE, MEMORY]</b> al comando de inicio.

<h2>Rutas</h2>
Los siguientes endpoint utilizados para entrar a las diferentes vistas en el navegador:

 - Sesiones
   - /session/login - ventana de inicio de sesión
   - /session/register - ventana para registrar usuario.
   - /session/forgot - ventana de recuperación de contraseña.
   - /restor-password/:id/:token - solo se puede acceder mediante enlace enviado por correo.
   - /current - muestra os datos del usuario actualmente conectado.
 - Productos
   - /products - muestra una galería de los productos.
   - /realtimeproducts - muestra listado de los productos y permite agregar o eliminar productos en tiempo real, únicamente para usuario administrador.
   - /product/:pid - muestra una vista detallada del producto. 
   - /products/register - muestra formulario para agregar nuevos productos, únicamente disponible para administrador o usuario premium.
 - carritos
   - /carts/:cid - muestra una descripción del contenido del carrito cantidad de productos y precio a pagar, únicamente disponible para usuario o usuario premium
 - Chat
   - /chat - muestra la vista del chat, únicamente disponible para usuario o usuario premium.

Endpoint de api son los siguientes:

 - Productos - /api/products
 - Carritos - /api/carts
 - Chat - /api/chat
 - Usuario - /api/users/premium/:uid -- cambia el rol de un usuario de user a premium y viseversa, únicamente disponible para administrador. 
 - Moking - /api/mocking/mockingproducts -- genera y agrega 100 productos, únicamente disponible para administrador. 

<h3>Accesos</h3>
Para poder probar las distintas funciones de la aplicación se puede ingresar con los siguientes usuarios:

 - Privilegio de administrador
   - usuario: <i>admin@admin.com</i>
   - contraseña: <i>"12345678"</i>
 - Privilegio de usuario premium
   - usuario: <i>pepe@pecas.com</i>
   - contraseña: <i>"12345678"</i>
