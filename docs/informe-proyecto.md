# TP Tecnologías Web - Informe Completo del Proyecto

## Historia del Proyecto y Entregas

### Primera Entrega - Backend (NestJS) + Postman

**Estado:** ✅ **COMPLETADA**

La primera entrega consistió en construir el backend de una aplicación full-stack utilizando NestJS con conexión a PostgreSQL mediante TypeORM. El proyecto tenía como objetivo principal crear una API REST funcional con dos entidades en relación 1:aN.

### Entregables Entregados:

1. **Dos entidades con relación 1:aN:**
   - **Entidad Origen:** Campos `id`, `region`, `clima`
   - **Entidad Planta:** Campos `id`, `nombreCientifico`, `nombreVulgar`, `clasificacion`, `epocaFloracion`, `origenId`
   - Relación: Un origen puede tener muchas plantas, pero una planta pertenece a un solo origen

2. **CRUD Completo:**
   - **Origen:** GET, GET/:id, POST, DELETE (sin PATCH - decisión de diseño: las origenes no se modifican)
   - **Planta:** GET, GET/:id, POST, PATCH/:id, DELETE

3. **Persistencia en PostgreSQL:**
   - Base de datos corriendo en Docker Container
   - TypeORM como ORM para mapear entidades a tablas
   - `synchronize: true` para crear tablas automáticamente
   - Conexión mediante variables de entorno (.env)

4. **Colección Postman:**
   - Endpoints probados y funcionales
   - Tests de creación, lectura, actualización y eliminación
   - Validación de respuestas y códigos de estado

5. **Buenas prácticas implementadas:**
   - Organización en módulos (OrigenModule, PlantaModule)
   - Validaciones con class-validator y class-transformer
   - Pipe de validación en main.ts (whitelist, forbidNonWhitelisted, transform)
   - Manejo de errores con excepciones personalizadas (NotFoundException, ConflictException, BadRequestException)
   - Codes de estado HTTP correctos a lo largo de todo el API

### Entregables Entregados:
- ✅ Repositorio en GitHub: `https://github.com/Anitandil/plantas`
- ✅ Colección Postman subida y funcional
- ✅ Código fuente con estructura limpia
- ✅ Informe detallado del proceso
- ✅ Base de datos poblada con datos de prueba

---

## Segunda Entrega - Frontend (Angular) + Deploy

**Estado:** *Pendiente de iniciar*

### Planificación para la Segunda Entrega:

**Entregables esperados:**
- **Frontend en Angular** consumiendo los endpoints del backend
- **CRUD completo** desde la UI (listar, crear, editar, eliminar)
- **Consumo exclusivo** de los endpoints de la primera entrega
- **Manejo de errores** y mensajes al usuario
- **Validación de formularios**
- **Deploy:**
  - Backend en Render
  - Frontend en Netlify

**Entregables esperados:**
- Repositorio de GitHub del frontend
- URLs de ambos deploys (Render y Netlify)

---

## Arquitectura del Proyecto

### Estructura de Carpetas

```
tp-tecnologias-web/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│├── origen/
│   ├── origen.entity.ts
│   ├── origen.controller.ts
│   ├── origen.service.ts
│   ├── origen.module.ts
│   └── dto/
│       └── create-origen.dto.ts
│
├── planta/
│   ├── planta.entity.ts
│   ├── planta.controller.ts
│   ├── planta.service.ts
│   ├── planta.module.ts
│   └── dto/
│       ├── create-planta.dto.ts
│       ├── update-planta.dto.ts
│       └── query-planta.dto.ts
├── app.module.ts
├── main.ts
├── .env
├── docker-compose.yml
├── package.json
└── package-lock.json
```

### Componentes Principales

#### 1. **Entidades (Entities)**

**Origen Entity:**
- `id`: primary key, autogenerado
- `region`: varchar, nombre geográfico
- `clima`: varchar, tipo de clima

**Planta Entity:**
- `id`: primary key, autogenerado
- `nombreCientifico`: varchar, nombre científico
- `nombreVulgar`: varchar, nombre común
- `clasificacion`: enum (Arbol, Arbusto, Mata, Hierba)
- `epocaFloracion`: varchar (nullable)
- `origenId`: foreign key a la tabla Origen
- Relación: `@ManyToOne` con `@JoinColumn`

#### 2. **Controladores (Controllers)**

**OrigenController:**
- GET /origen - Listar todos
- GET /origen/:id - Buscar por ID
- POST /origen - Crear nuevo
- DELETE /origen/:id - Eliminar (con protección contra plantas asociadas)

**PlantaController:**
- GET /planta - Listar con filtros y paginación
- GET /planta/:id - Buscar por ID
- POST /planta - Crear nueva
- PATCH /planta/:id - Modificar parcialmente
- DELETE /planta/:id - Eliminar

#### 3. **Servicios (Services)**

**OrigenService:**
- CRUD completo sobre orígenes
- Validación de que no se pueda borrar si tiene plantas asociadas
- Método `findOrCreate` para buscar o crear si no existe

**PlantaService:**
- CRUD completo sobre plantas
- Filtros: clasificación, nombre, región, clima
- Paginación: page y limit
- Ordenamiento: sortBy y order
- Validación de datos antes de guardar

#### 3. **DTOs (Data Transfer Objects)**

**CreatePlantaDto:**
- nombreCientifico (obligatorio)
- nombreVulgar (obligatorio)
- clasificacion (obligatorio, enum)
- tamanio (eliminado, reemplazado por clasificacion)
- epocaFloracion (opcional)
- origenId (obligatorio)

**UpdatePlantaDto:**
- Todos los campos opcionales (solo los que se quieran modificar)
- Validaciones en cada campo

**QueryPlantaDto:**
- filtros: clasificacion, nombre, region, clima
- paginación: page, limit
- ordenamiento: sortBy, order

### 3. Validaciones Implementadas

**class-validator y class-transformer:**

| Validación | Para Qué Sirve |
|---|---|
| `@IsNotEmpty()` | Campo obligatorio |
| `@IsString()` | Validar que sea texto |
| `@IsEnum()` | Validar enum (Clasificacion, Tipo) |
| `@IsInt()` | Validar número entero |
| `@IsOptional()` | Campo opcional |
| `@Min()` | Validar mínimo |
| `@Type()` | Convertir tipos |

### 4. Manejo de Errores

| Excepción | Código HTTP | Cuándo se usa |
|---|---|---|
| `NotFoundException` | 404 | ID no existe |
| `BadRequestException` | 400 | Datos inválidos |
| `ConflictException` | 409 | Nombre duplicado, borrar con plantas |

### 5. Herramientas Utilizadas

| Herramienta | Para Qué |
|---|---|
| **PostgreSQL** | Base de datos relacional |
| **Docker** | Contenedorizar la BD |
| **NestJS** | Framework backend |
| **TypeORM** | Mapeo objeto-relacional |
| **VS Code** | Entorno de desarrollo |
| **SQLTools** | Ver datos en BD |
| **Postman/Thunder Client** | Probar endpoints |
| **Git/GitHub** | Control de versiones |
| **class-validator** | Validaciones DTO |
| **class-transformer** | Transformación de tipos |

## Características Implementadas

### 1. **Relación 1:aN entre Origen y Planta**
- Un origen puede tener muchas plantas
- Una planta pertenece a un solo origen
- FK `origenId` en la tabla Planta
- Protección contra borrar orígenes con plantas asociadas

### 2. **Paginación y Filtros**
- `?page=N&limit=M` para paginación
- `?clasificacion=` filtrar por tipo
- `?nombre=` búsqueda parcial
- `?sortBy=&order=` ordenamiento
- `?format=short/full` vista resumida/ completa

### 3. Validaciones Robustas
- Todos los DTOs tienen validaciones `@IsNotEmpty()`, `@IsString()`, etc.
- Pipe `ValidationPipe` con `whitelist: true`
- Errores consistentes con códigos HTTP apropiados

### 3. Migraciones Importantes

1. **De `Tamanio` a `Clasificacion`:**
   - Se eliminó el enum `Tamanio` (Pequeño/Mediano/Grande)
   - Se creó el enum `Clasificacion` (Arbol, Arbusto, Mata, Hierba)
   - Justificación: la clasificación define implícitamente el tamaño

2. **De `Tipo` a `Clasificacion`:**
   - Renombrado de enum para ser más descriptivo
   - Actualización en entity, DTOs y service

3. **Migración a PostgreSQL:**
   - Migración de arrays en memoria a base de datos relacional
   - `synchronize: true` para crear tablas automáticamente
   - Migración exitosa de datos existentes

### 4. Mejoras Implementadas

- ✅ Filtros combinados (múltiples filtros al mismo tiempo)
- ✅ Paginación implementada con TypeORM `skip`/`take`
- ✅ Formato de salida `format=short/full`
- ✅ Filtros por región y clima (join con tabla Origen)
- ✅ Protección contra borrado de orígenes con plantas asociadas
- ✅ Enum `Tipo` → `Clasificacion` (más descriptivo)
- ✅ Postman collection funcional con todos los endpoints

### Características Técnicas Destacadas

**Tecnologías Utilizadas:**
- **NestJS:** Framework backend con arquitectura modular
- **TypeScript:** Tipado fuerte que previene errores
- **TypeORM:** ORM para conexión con PostgreSQL
- **PostgreSQL:** Base de datos relacional robusta y escalable

**Arquitectura:**
- Patrón MVC (Model-View-Controller) adaptado a NestJS
- Inyección de dependencias automática
- Separación de responsabilidades (controllers, services, entities)
- Módulos separados (OrigenModule, PlantaModule)

### Validaciones en Profundidad

**DTOs Validados:**
- `CreatePlantaDto` - creación de plantas (validaciones obligatorias)
- `UpdatePlantaDto` - actualizaciones parciales (todos opcionales)
- `QueryPlantaDto` - filtros y paginación en listados
- `CreateOrigenDto` - creación de orígenes

**Tipos de Validación Utilizados:**
- `@IsNotEmpty()` - campo no puede estar vacío
- `@IsString()` - debe ser texto
- `@IsInt()` - debe ser entero
- `@IsEnum()` - debe ser valor del enum
- `@IsOptional()` - campo opcional
- `@Min()` - mínimo permitido
- `@Type()` - conversión de tipos

### Seguridad y buenas prácticas:

- `.env` en `.gitignore` (no subir credenciales a GitHub)
- `synchronize: true` para development
- Codes de estado HTTP apropiados
- Whitelist y `forbidNonWhitelisted` en ValidationPipe
- Validaciones que evitan datos inconsistentes

## Qué se Entregó en la Primera Entrega

1. ✅ **Backend completo** con NestJS y TypeORM
2. ✅ **Dos entidades** con relación 1:aN
3. ✅ **CRUD completo** para ambas entidades
4. **Filtrado** por clasificación, nombre, región, clima
5. **Paginación** y ordenamiento
6. **Postman collection** funcional
7. **Validaciones** con class-validator
8. **Códigos de estado HTTP** correctos
9. **Base de datos PostgreSQL** con TypeORM
10. **Repo en GitHub** con historial de commits

## Próximos Pasos (Segunda Entrega)

1. **Frontend en Angular** consumiendo los endpoints
2. **CRUD desde la UI** (listar, crear, editar, eliminar)
3. **Deploy** en Render (backend) y Netlify (frontend)
4. **Manejo de formularios** con validación
5. **Comunicación entre componentes** con servicios
6. **Navegación** con routing angular

## Reflexiones Finales

### Lo que se aprendió:
- Migración de datos de arrays en memoria a base de datos relacional
- Implementación de enums y validaciones robustas
- Arquitectura NestJS con módulos y servicios
- Manejo de relaciones 1:aN en base de datos
- Filtros combinados y paginación en API REST
- Deploy y configuración de variables de entorno

**Lo que se podría mejorar:**
- Agregar tests automatizados
- Implementar autenticación y autorización
- Mejorar el diseño visual del frontend
- Agregar más filtros y funcionalidades
- Optimizar queries de base de datos

**Lecciones aprendidas:**
- La importancia de planificar el esquema de base de datos antes de empezar
- La utilidad de los enums para validar datos consistentes
- La importancia de los DTOs y validaciones para la integridad de datos
- La necesidad de paginación cuando se trabaja con bases de datos grandes
- La importancia de los códigos de estado HTTP apropiados

## Próximos Pasos Recomendados

1. **Entregar la primera parte** con el informe correspondiente
2. **Planificar la segunda entrega** (Frontend Angular)
3. **Definir fechas** de entrega con el profesor
4. **Preparar la defensa** del TP
5. **Revisar y mejorar** algún aspecto que se identifique como oportunidad

---

## Resumen Ejecutivo

El proyecto TP de Tecnologías Web consistió en construir un backend full-stack con NestJS y TypeORM conectado a PostgreSQL. Se logró implementar:

- ✅ Dos entidades en relación 1:aN (Origen → Planta)
- ✅ CRUD completo para ambas entidades
- ✅ Filtros y paginación implementados
- ✅ Validaciones robustas con class-validator
- ✅ Códigos de estado HTTP apropiados
- ✅ Colección Postman funcional
- ✅ Base de datos PostgreSQL con Docker
- ✅ Repositorio en GitHub con historial de commits

**El proyecto demuestra un progreso significativo** desde conceptos básicos hasta una aplicación funcional con buenas prácticas de desarrollo backend, preparando el camino para la segunda entrega enfocada en el frontend Angular.

---
*Fecha de generación: Octubre 2026*
*Herramientas utilizadas: NestJS, TypeScript, PostgreSQL, TypeORM, Docker, VS Code*
*Autor: Estudiantes de Tecnologías Web (TUARI/UNICEN)*
*Finalidad: Entrega del Trabajo Práctico del curso*