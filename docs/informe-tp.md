# TP Tecnologías Web - Backend NestJS

## 📚 Descripción general
Aplicación backend con **NestJS** y **TypeORM**, conectada a una base de datos **PostgreSQL** mediante Docker. El sistema gestiona dos entidades con relación **1:a N**: **Origen** y **Planta**.

---

## 🛠️ Tecnologías utilizadas
- **NestJS** (Framework backend)
- **TypeScript** (Lenguaje)
- **TypeORM** (ORM para base de datos)
- **PostgreSQL** (Base de datos relacional)
- **Docker** (Contenedorizar la base de datos)
- **VS Code** (Entorno de desarrollo)
- **SQLTools** (Ver datos en la BD)
- **Postman** / **Thunder Client** (Probar endpoints)

---

## 🚀 ¿Cómo correr la aplicación?

### 1. Levantar la base de datos (PostgreSQL)
```powershell
# Desde la carpeta del proyecto (C:\Users\Usuario\plantas)
docker-compose up -d
```
La base de datos quedará corriendo en segundo plano.

### 2. Levantar la aplicación NestJS
```powershell
npm run start:dev
```
La aplicación correrá en: `http://localhost:3000`

### 3. Verificar que todo funciona
Abrir en el navegador o Postman:
- `GET http://localhost:3000/origen` → Debería listar los orígenes registrados
- `GET http://localhost:3000/planta` → Debería traer las plantas registradas

---

## 📡 Endpoints de la API

### **Endpoints Origen** (`/origen`)
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/origen` | Listar todos los orígenes |
| `GET` | `/origen/:id` | Buscar un origen por ID |
| `POST` | `/origen` | Crear un nuevo origen |
| `PATCH` | `/origen/:id` | Actualizar región, clima o ambos |
| `DELETE` | `/origen/:id` | Eliminar un origen (con protección si tiene plantas) |

**Ejemplo POST:**
```json
{
  "region": "America del Sur",
  "clima": "Subtropical"
}
```

### Endpoints Planta (`/planta`)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/planta` | Listar todas las plantas (con filtros) |
| `GET` | `/planta/:id` | Buscar una planta por ID |
| `POST` | `/planta` | Crear una nueva planta |
| `PATCH` | `/planta/:id` | Modificar una parcialmente |
| `DELETE` | `/planta/:id` | Eliminar una planta |

**Ejemplo POST:**
```json
{
  "nombreCientifico": "Ficus benjamina",
  "nombreVulgar": "Ficus",
  "clasificacion": "Arbol",
  "epocaFloracion": "Todo el año",
  "origenId": 1
}
```

### Filtros disponibles en `GET /planta`:
- `?clasificacion=Arbol` - Filtrar por clasificación
- `?nombre=ficus` - Filtrar por nombre científico o vulgar
- `?page=1&limit=10` - Paginar resultados
- `?sortBy=nombreVulgar&order=asc` - Ordenar por un campo permitido
- `?format=short` - Vista resumida (`1: Nombre (Cientifico)`); `full` devuelve los objetos completos

---

## ✅ Validaciones: tipos y ubicación

Las validaciones están implementadas principalmente con **class-validator** en los DTO. Se activan globalmente desde `src/main.ts`, por lo que se aplican a los cuerpos y parámetros de consulta que reciben los controladores.

### Configuración global — `src/main.ts`

`ValidationPipe` usa estas opciones:

- `whitelist: true`: considera únicamente propiedades declaradas en el DTO.
- `forbidNonWhitelisted: true`: devuelve `400 Bad Request` si se envía una propiedad no declarada.
- `transform: true`: transforma los valores de entrada a los tipos declarados cuando existe la configuración correspondiente, por ejemplo, convertir `page` y `limit` a números.

### Validación de los cuerpos (body)

| DTO y ubicación | Validaciones | Uso |
|---|---|---|
| `src/origen/dto/create-origen.dto.ts` — `CreateOrigenDto` | `@IsString()` y `@IsNotEmpty()` en `region` y `clima` | `POST /origen` |
| `src/origen/dto/update-origen.dto.ts` — `UpdateOrigenDto` | Hereda las validaciones de `CreateOrigenDto` y vuelve opcionales sus campos mediante `PartialType` | `PATCH /origen/:id`; permite enviar `region`, `clima` o ambos |
| `src/planta/dto/create-planta.dto.ts` — `CreatePlantaDto` | `@IsString()` y `@IsNotEmpty()` en los nombres; `@IsEnum()` en `clasificacion`; `@IsOptional()` y `@IsString()` en `epocaFloracion`; `@Type(() => Number)` y `@IsInt()` en `origenId` | `POST /planta` |
| `src/planta/dto/update-planta.dto.ts` — `UpdatePlantaDto` | Hereda las validaciones de `CreatePlantaDto` y vuelve opcionales sus campos mediante `PartialType` | `PATCH /planta/:id` |

### Validación de parámetros de consulta — `src/planta/dto/query-planta.dto.ts`

`QueryPlantaDto`, recibido en `GET /planta`, valida las opciones de búsqueda:

- `nombre`: texto opcional.
- `clasificacion`: valor del enum `Clasificacion`.
- `sortBy`: uno de los campos permitidos para ordenar.
- `order`: `asc` o `desc`.
- `page` y `limit`: enteros mayores o iguales a 1; se convierten a número con `@Type(() => Number)`.
- `format`: `short` o `full`.

Cada una es opcional (`@IsOptional()`), así que se pueden combinar únicamente las opciones necesarias. Este DTO es solo para consultar plantas; no se usa para actualizar orígenes.

### Validaciones adicionales en controladores y servicios

- `src/origen/origen.controller.ts` y `src/planta/planta.controller.ts`: `ParseIntPipe` valida que los parámetros `:id` de las rutas sean números enteros. Un ID inválido produce `400 Bad Request`.
- `src/origen/origen.service.ts`: al crear o actualizar, recorta espacios y rechaza región o clima vacíos (`400`). También impide duplicar la combinación de región y clima (`409`). Un ID inexistente produce `404`; no permite eliminar un origen asociado a plantas (`409`).
- `src/planta/planta.service.ts`: al crear o actualizar, rechaza nombres vacíos (`400`), verifica que el origen indicado exista y devuelve `404` si la planta buscada no existe.

> Las reglas de DTO validan el tipo y la presencia de los datos. Las comprobaciones que dependen de la base de datos —por ejemplo, si un origen existe o si la combinación ya está registrada— se realizan en los servicios.

---

## 🗄️ Base de datos

**Credenciales de acceso:**
- **Usuario:** `Ana`
- **Contraseña:** `123456`
- **Base de datos:** `Plantas-Origen`
- **Puerto:** `5432`

**Para ver los datos en la base de datos:**
1. Levantar Adminer o SQLTools en VS Code
2. Acceder con los datos de arriba
3. Seleccionar la base de datos `Plantas-Origen`
4. Ver tablas: `origen` y `planta`

### Estructura de las tablas:

**Tabla `origen`:**
- `id` (PK, autogenerado)
- `region` (ej: "America del Sur")
- `clima` (ej: "Subtropical")

**Tabla `planta`:**
- `id` (PK, autogenerado)
- `nombreCientifico` (ej: "Ficus benjamina")
- `nombreVulgar` (ej: "Ficus")
- `clasificacion` (ej: "Arbol", "Arbusto", "Mata", "Hierba")
- `epocaFloracion` (ej: "Todo el año", "Primavera")
- `origenId` (FK a la tabla `origen`)

---

## 📦 Entregables incluidos en este repositorio

✅ **Código fuente** (`src/`) con todos los controladores, servicios y DTOs  
✅ **Configuración Docker** (`docker-compose.yml`)  
✅ **Archivo `.env`** con credenciales (ya está en `.gitignore`)  
✅ **Colección Postman** con todos los endpoints probados  
✅ **Migraciones de TypeORM** (schema actualizado)  
✅ **Historial de commits** con los cambios realizados  

### Cómo subir a GitHub:
```powershell
# Desde la carpeta del proyecto (C:\Users\Usuario\plantas)
git add .
git commit -m "Entrega TP - Backend NestJS con TypeORM"
git push origin main
```


**¿Necesito volver a migrar la BD si cambio algo en los entities?**
Con `synchronize: true` en `app.module.ts`, TypeORM actualiza automáticamente el schema. Pero en producción se recomienda usar migraciones (`npm run typeorm migration:run`).

