# Informe de avances y commits

## 1. Resumen del proyecto

El proyecto consiste en una API REST para administrar plantas y sus orígenes. Se inició con NestJS y datos en memoria, y evolucionó hasta utilizar TypeORM con PostgreSQL. La API incluye operaciones de consulta, creación, actualización y eliminación, validaciones de entrada y reglas de integridad entre las entidades.

## 2. Evolución del proyecto

### Inicio y funcionalidades principales

- **01/09/2026 — `a58dbba` — Scaffold inicial NestJS:** creación de la estructura base de la aplicación.
- **03/09/2026 — `cfda45f` — Entidades y servicios en memoria:** incorporación de `Origen` y `Planta`, sus controladores, módulos y servicios iniciales.
- **05/09/2026 — `feb0a6d` — CRUD y filtro por clasificación:** implementación de las operaciones principales para ambos recursos y de la primera consulta filtrada.

### Validaciones y reglas de negocio

- **11/09/2026 — `6901459` — Validaciones para orígenes y plantas:** ampliación de las reglas de entrada y las consultas.
- **11/09/2026 — `88d020d` — Protección al eliminar orígenes:** se impide borrar un origen que todavía tenga plantas relacionadas.
- **12/09/2026 — `cb87044` — Reglas adicionales y retiro temporal de la actualización de origen:** se reforzaron validaciones; en ese momento se decidió no ofrecer `PATCH` para origen.
- **16/09/2026 — `78225d5` — DTO de actualización de planta:** incorporación de `UpdatePlantaDto` para aceptar actualizaciones parciales.
- **16/09/2026 — `095c665` — Validación con `class-validator`:** definición de validaciones en DTOs y activación del `ValidationPipe` global.

### Pruebas y persistencia

- **18/09/2026 — `942751f` — Colección de Postman:** incorporación de requests y entorno para probar las operaciones de la API.
- **18/09/2026 — `b8f0478` — Mejoras en filtros y eliminación:** ajustes a validaciones y consultas; incorporación de la configuración de Docker y documentación de la API.
- **19/09/2026 — `dc7a00c` — Migración a PostgreSQL y TypeORM:** reemplazo del almacenamiento en memoria por persistencia relacional; ajuste de entidades, módulos, servicios y filtros; actualización de la clasificación de plantas.
- **24/09/2026 — `232a6b8` — Correcciones y documentación:** ajustes posteriores a la migración y cambios en las consultas y filtros.

### Informes y actualización de origen

- **15/10/2026 — `45bfb2c` — Informe de entrega:** incorporación de `informe-tp.md` a `master` en GitHub.
- **15/10/2026 — `54ebaf2` — Informe del proyecto:** commit local que agregó informes de entrega. Este commit no se había subido a `origin/master` al preparar este documento.
- **22/10/2026 — `56d7d04` — Restauración de la actualización de origen:** incorporación de `PATCH /origen/:id`, `UpdateOrigenDto` y un request de Postman. Este cambio está publicado en la rama `feat/update-origen`, separado de `master`.

## 3. Funcionalidad actual

### Orígenes

La API permite listar, consultar por ID, crear, actualizar parcialmente y eliminar orígenes. La actualización acepta `region`, `clima` o ambos. Se rechazan campos vacíos y combinaciones de región y clima duplicadas. No se permite eliminar un origen con plantas asociadas.

### Plantas

La API permite listar, consultar por ID, crear, actualizar parcialmente y eliminar plantas. Cada planta tiene nombres científico y vulgar, clasificación, época de floración opcional y referencia a un origen. El listado admite filtro por nombre o clasificación, ordenamiento, paginación y formato resumido o completo.

### Validaciones y errores

Los DTOs validan los cuerpos de creación y actualización y los parámetros de consulta de plantas. El `ValidationPipe` global rechaza propiedades desconocidas; `ParseIntPipe` valida los IDs de ruta. Los servicios comprueban reglas que dependen de la base de datos, como la existencia del origen asociado, duplicados y restricciones de borrado. La API utiliza `400 Bad Request`, `404 Not Found` y `409 Conflict` según el tipo de error.

