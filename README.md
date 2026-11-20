# PetCare – API Clínica Veterinaria

Backend en Spring Boot (Entity → Repository → Service → Controller) con relaciones Dueño 1—N Mascota 1—N Cita, y frontend opcional en React.

## Estructura
- `backend/` → API Spring Boot (ver `backend/README.md`)
- `frontend/` → React + Vite (ver `frontend/README.md`)
- Colección Postman: `backend/postman/PetCare.postman_collection.json`

## Cómo ejecutar
1. **Backend:** abrir `backend` en IntelliJ y ejecutar `PetcareApplication` → http://localhost:8080
2. **Frontend:** en `frontend` ejecutar `npm install` y luego `npm run dev` → http://localhost:5173
3. **Postman:** importar la colección y ejecutar las carpetas en orden (1 → 5)

## Integrantes
- Eliot Ibacache
- (agregar integrantes)

## Estado
**Logrado:** entidades y relaciones, repositorios, servicios con validaciones, CRUD completo, endpoints de relación, manejo de errores, colección Postman y frontend React.

**Pendiente:** capturas de Postman y commits de todos los integrantes.
