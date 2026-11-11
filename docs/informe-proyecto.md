# Informe del proyecto: API de plantas

## 1. Objetivo y alcance

El proyecto implementa una API REST para administrar plantas y sus orígenes. Está desarrollada con NestJS y TypeORM, y utiliza PostgreSQL para persistir los datos.

## 2. Tecnologías y arquitectura

- **NestJS y TypeScript:** estructura modular, controladores y servicios.
- **TypeORM:** acceso a datos y mapeo de entidades.
- **PostgreSQL:** base de datos relacional, levantada mediante Docker Compose.
- **class-validator y class-transformer:** validación y transformación de datos.
- **Postman:** prueba manual de los endpoints mediante la colección incluida en el repositorio.

El código se organiza en módulos independientes para `Origen` y `Planta`. Los controladores reciben las solicitudes HTTP y delegan las operaciones a los servicios, que aplican las reglas de negocio y acceden a los repositorios de TypeORM.

## 3. Modelo de datos

### Origen

Contiene `id`, `region` y `clima`.

### Planta

Contiene `id`, `nombreCientifico`, `nombreVulgar`, `clasificacion`, `epocaFloracion` y `origenId`. La clasificación corresponde a uno de estos valores: `Arbol`, `Arbusto`, `Mata` o `Hierba`. La época de floración es opcional.

La relación es de uno a muchos: un origen puede estar asociado a varias plantas y cada planta pertenece a un origen.

## 4. Endpoints

| Recurso | Método y ruta | Función |
|---|---|---|
| Origen | `GET /origen` | Lista los orígenes. |
| Origen | `GET /origen/:id` | Busca un origen por ID. |
| Origen | `POST /origen` | Crea un origen. |
| Origen | `PATCH /origen/:id` | Actualiza `region`, `clima` o ambos. |
| Origen | `DELETE /origen/:id` | Elimina un origen si no tiene plantas asociadas. |
| Planta | `GET /planta` | Lista plantas; admite filtros, ordenamiento, paginación y formato de salida. |
| Planta | `GET /planta/:id` | Busca una planta por ID. |
| Planta | `POST /planta` | Crea una planta asociada a un origen existente. |
| Planta | `PATCH /planta/:id` | Actualiza uno o varios campos de una planta. |
| Planta | `DELETE /planta/:id` | Elimina una planta. |

### Consulta de plantas

`GET /planta` acepta parámetros opcionales definidos por `QueryPlantaDto`:

- `nombre`: busca coincidencias parciales en el nombre científico o vulgar.
- `clasificacion`: filtra por el valor de clasificación.
- `sortBy` y `order`: ordenan por un campo permitido, ascendente o descendentemente.
- `page` y `limit`: paginan los resultados; por defecto se usa la página 1 y un límite de 10.
- `format`: `full` devuelve los objetos completos y `short` devuelve una descripción breve.

Los filtros pueden combinarse. La respuesta incluye los datos y la información de paginación.

## 5. Validaciones y manejo de errores

Las validaciones de los DTO se ejecutan mediante el `ValidationPipe` global configurado en `src/main.ts`:

- `whitelist: true` permite únicamente las propiedades definidas en el DTO.
- `forbidNonWhitelisted: true` rechaza propiedades desconocidas.
- `transform: true` transforma valores cuando el DTO especifica cómo hacerlo.

| Dónde | Reglas aplicadas |
|---|---|
| `src/origen/dto/create-origen.dto.ts` — `CreateOrigenDto` | `region` y `clima` deben ser texto no vacío (`@IsString`, `@IsNotEmpty`). |
| `src/origen/dto/update-origen.dto.ts` — `UpdateOrigenDto` | Usa `PartialType(CreateOrigenDto)`: ambos campos son opcionales; los que se envían conservan las validaciones de creación. |
| `src/planta/dto/create-planta.dto.ts` — `CreatePlantaDto` | Los nombres son texto no vacío; `clasificacion` debe pertenecer al enum; `epocaFloracion` es texto opcional; `origenId` debe ser entero. |
| `src/planta/dto/update-planta.dto.ts` — `UpdatePlantaDto` | Usa `PartialType(CreatePlantaDto)`: permite actualizar campos individualmente y aplica las reglas correspondientes a los campos enviados. |
| `src/planta/dto/query-planta.dto.ts` — `QueryPlantaDto` | Valida los parámetros opcionales del listado: texto y enum para filtros, campos y dirección de orden permitidos, enteros positivos para `page` y `limit`, y `short` o `full` para `format`. |
| Controladores de origen y planta | `ParseIntPipe` valida que los parámetros `:id` sean enteros. |
| Servicios de origen y planta | Aplican reglas que dependen de la lógica de negocio o de la base de datos. |

Los servicios recortan espacios en los campos de texto que crean o actualizan. Rechazan nombres, región o clima vacíos; comprueban la existencia de los IDs relacionados y evitan duplicar la combinación de región y clima. Además, impiden borrar un origen que tenga plantas asociadas.

Los errores se devuelven con estos códigos HTTP:

| Código | Significado en la API | Ejemplos |
|---|---|---|
| `400 Bad Request` | La solicitud tiene un parámetro o dato inválido. | ID no entero; campos vacíos; valor que no cumple el DTO; propiedad desconocida. |
| `404 Not Found` | El recurso solicitado no existe. | Buscar, actualizar o eliminar un ID inexistente; asociar una planta a un origen inexistente. |
| `409 Conflict` | La operación contradice el estado o las reglas de los datos. | Crear o actualizar un origen con una combinación región-clima ya existente; borrar un origen con plantas asociadas. |

## 6. Configuración y ejecución

La configuración de PostgreSQL se carga desde variables de entorno mediante `ConfigModule` en `src/app.module.ts`. Las credenciales locales se guardan en `.env`, archivo que no debe incluirse en el repositorio.

Para iniciar la base de datos y la API desde la raíz del proyecto:

```powershell
docker-compose up -d
npm install
npm run start:dev
```

La API queda disponible, por defecto, en `http://localhost:3000`. En desarrollo, TypeORM está configurado con `synchronize: true` para sincronizar el esquema a partir de las entidades; para producción se recomienda gestionar los cambios del esquema mediante migraciones.

## 7. Verificación

La colección de Postman permite probar manualmente las operaciones y las respuestas de la API. El proyecto también incluye pruebas automatizadas con Jest. Para compilar y ejecutar las pruebas:

```powershell
npm run build
npm test -- --runInBand
```
