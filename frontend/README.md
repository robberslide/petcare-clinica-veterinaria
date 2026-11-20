# PetCare – Frontend React

Frontend en React + Vite que consume la API PetCare (Spring Boot).

## Pantallas
1. **Dueños** (`/`): listado + formulario para registrar dueños.
2. **Mascotas de un dueño** (`/duenos/:id`): usa `GET /api/duenos/{id}/mascotas` + formulario para agregar mascota.
3. **Citas de una mascota** (`/mascotas/:id`): usa `GET /api/mascotas/{id}/citas` + **formulario para registrar cita**.

## Cómo ejecutar
1. Levanta primero el backend (`http://localhost:8080`).
2. En esta carpeta: `npm install`
3. Luego: `npm run dev`
4. Abre `http://localhost:5173`

La URL del backend está en `src/api.js` (variable `baseURL`).
