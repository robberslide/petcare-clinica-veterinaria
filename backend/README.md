# PetCare – API Clínica Veterinaria 🐾

Backend en **Spring Boot 3 + JPA** con arquitectura **Entity → Repository → Service → Controller** y tres entidades relacionadas: **Dueño 1—N Mascota 1—N Cita**.

## Estructura

```
src/main/java/cl/duoc/petcare
├── model/        Dueno, Mascota, Cita          (entidades JPA + relaciones)
├── repository/   DuenoRepository, ...          (JpaRepository)
├── service/      DuenoService, ...             (lógica y validaciones)
├── controller/   DuenoController, ...          (endpoints REST)
├── dto/          MascotaRequest, CitaRequest   (cuerpo del POST/PUT con duenoId / mascotaId)
└── exception/    Manejo global de errores (404 / 400 en JSON)
postman/PetCare.postman_collection.json         (todas las pruebas listas)
```

## Requisitos

- Java 17 o superior
- Maven (o usar el que trae IntelliJ / VS Code)
- Postman

## Paso a paso para ejecutar

1. Abre la carpeta `petcare` en IntelliJ IDEA (o VS Code con Extension Pack for Java). Espera a que Maven descargue las dependencias.
2. Ejecuta `PetcareApplication.java` (botón ▶) o en terminal: `mvn spring-boot:run`.
3. La API queda en `http://localhost:8080`.
4. Por defecto usa **H2 en memoria** (no hay que instalar nada; los datos se borran al reiniciar). Consola: `http://localhost:8080/h2-console` → JDBC URL `jdbc:h2:mem:petcare`, usuario `sa`, sin clave.
5. Si quieren **MySQL**: en `application.properties` comenten el bloque H2 y descomenten el de MySQL. La BD `petcare` se crea sola.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET / POST | `/api/duenos` | Listar / crear dueños |
| GET / PUT / DELETE | `/api/duenos/{id}` | Ver / editar / eliminar dueño |
| GET | `/api/duenos/{id}/mascotas` | **Mascotas de un dueño** |
| GET / POST | `/api/mascotas` | Listar / crear mascotas |
| GET / PUT / DELETE | `/api/mascotas/{id}` | Ver / editar / eliminar mascota |
| GET | `/api/mascotas/{id}/citas` | **Citas de una mascota** |
| GET / POST | `/api/citas` | Listar / crear citas |
| GET / PUT / DELETE | `/api/citas/{id}` | Ver / editar / eliminar cita |

### Ejemplos de body

```json
POST /api/duenos
{ "rut": "12.345.678-9", "nombre": "Camila Rojas", "telefono": "+56912345678", "email": "camila@mail.cl" }

POST /api/mascotas
{ "nombre": "Toby", "especie": "Perro", "raza": "Beagle", "fechaNacimiento": "2021-03-15", "duenoId": 1 }

POST /api/citas
{ "fecha": "2026-11-20T10:30:00", "motivo": "Control anual", "diagnostico": "Sano", "costo": 25000, "mascotaId": 1 }
```

## Validaciones de la capa Service

- No se puede crear/editar una **cita** para una mascota inexistente → `404`.
- No se puede crear/editar una **mascota** para un dueño inexistente → `404`.
- RUT de dueño único (se normaliza: `12.345.678-k` → `12345678-K`) → `400` si se repite.
- La fecha de la cita no puede ser anterior al nacimiento de la mascota → `400`.
- Campos obligatorios, email válido, costo ≥ 0, fecha de nacimiento no futura → `400` con detalle por campo.
- Eliminar un dueño elimina en cascada sus mascotas y las citas de éstas.

## Pruebas en Postman (evidencia)

1. En Postman: **Import** → selecciona `postman/PetCare.postman_collection.json`.
2. Con la API corriendo, ejecuta las carpetas **en orden** (1 → 5). Los POST guardan solos el `id` creado en las variables `duenoId`, `mascotaId` y `citaId`, así que los siguientes requests funcionan sin editar nada.
3. Cada request tiene un test del código HTTP esperado (pestaña *Test Results*).
4. Captura sugerida para la entrega: un POST, un GET de cada endpoint de relación, y la carpeta *4. Validaciones* mostrando los 404/400. También pueden usar **Run collection** y capturar el resumen con todos los tests en verde.

## Estado del avance

**Logrado:** entidades y relaciones, repositorios, servicios con validaciones, CRUD completo de las tres entidades, endpoints de relación, manejo de errores y colección de Postman.

**Pendiente / opcional:** frontend React (listar dueños, ver mascotas, formulario de cita). El backend ya tiene CORS habilitado para consumirlo con `fetch` o `axios`.
