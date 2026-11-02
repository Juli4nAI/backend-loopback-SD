# API REST con LoopBack 4

Backend de un carrito de compras hecho con **LoopBack 4** (Node.js + TypeScript) y **MongoDB Atlas**.

### Alumnos:
- Julián Carmona
- Damian Joannas
- Mateo Flegler

## Modelo

![Modelo de clases](docs/capturas/00-modelo.png)

Un usuario tiene carritos, y cada carrito guarda sus artículos con la cantidad en `ItemCarrito`.

## Cómo ejecutarlo

```bash
npm install
copy .env.example .env    # pegar la URL de MongoDB Atlas en MONGODB_URL
npm start
```

Abrir http://localhost:3000/explorer

## Flujo de prueba

### 1. Crear un usuario — `POST /usuarios`

![Crear usuario](docs/capturas/01-crear-usuario-request.png)
![Usuario creado](docs/capturas/02-crear-usuario-response.png)

### 2. Crear artículos — `POST /articulos`

![Artículo 1](docs/capturas/03-crear-articulo-1.png)
![Artículo 2](docs/capturas/04-crear-articulo-2.png)

### 3. Crear el carrito del usuario — `POST /usuarios/{id}/carritos`

El carrito queda asociado al usuario por `usuarioId`.

![Carrito creado](docs/capturas/05-crear-carrito.png)

### 4. Agregar un artículo al carrito — `POST /carritos/{id}/articulos`

![Artículo agregado](docs/capturas/06-agregar-articulo.png)

### 5. Ver el carrito — `GET /carritos/{id}/articulos`

Devuelve los artículos con su cantidad, subtotal y el total.

![Ver carrito](docs/capturas/07-ver-carrito.png)

### 6. Validación — artículo con costo negativo

La API rechaza el dato con **422 Unprocessable Entity**.

![Error 422](docs/capturas/08-error-costo-negativo.png)

### 7. Datos guardados en MongoDB (Compass)

La base `api_rest_loopback` tiene una colección por modelo.

![Compass](docs/capturas/09-compass-usuario.png)
