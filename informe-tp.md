# TP Tecnologías Web - Backend NestJS

## 📚 Descripción general
Aplicación backend desenvolvida con **NestJS** y **TypeORM**, conectada a una base de datos **PostgreSQL** mediante Docker. El sistema gestiona dos entidades con relación **1:a N**: **Origen** y **Planta**.

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
- `GET http://localhost:3000/origen` → Debería traer 2 orígenes
- `GET http://localhost:3000/planta` → Debería traer las plantas registradas

---

## 📡 Endpoints de la API

### **Endpoints Origen** (`/origen`)
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/origen` | Listar todos los orígenes |
| `GET` | `/origen/:id` | Buscar un origen por ID |
| `POST` | `/origen` | Crear un nuevo origen |
| `DELETE` | `/origen/:id` | Eliminar un origen (con protección si tiene plantas) |

**Ejemplo POST:**
```json
{
  "region": "America del Sur",
  "clima": "Subtropical"
}
```

### 
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
- `?nombre=ficus` - Filtrar por nombre (científico o vulgar)
- `?region=Patagonia` - Filtrar por región del origen
- `?clima=Templado` - Filtrar por clima del origen
- `?page=1&limit=10` - Paginación
- `?sortBy=nombreVulgar&order=asc` - Ordenamiento
- `?format=short` - Vista resumida (`1: Nombre (Cientifico)`)

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

---

## 📦 ¿Qué NO está incluido (y por qué)?

- ❌ **Datos de prueba masivos** - Los datos se cargan al primer run o se pueden agregar manualmente por Postman
- ❌ **Archivo `.env` en Git** - Está en `.gitignore` por seguridad (usar las credenciales por defecto o las propias)
- ❌ **Docker Desktop siempre corriendo** - Solo necesario para la BD, el código funciona una vez compilado

---

## 📋 Checklist de verificación final

Antes de entregar, verificar que:
- [ ] `npm run build` pasa sin errores
- [ ] `npm run start:dev` levanta la app y conecta a la BD
- [ ] Los endpoints principales funcionan en Postman/Thunder Client
- [ ] La colección Postman está subida al repositorio
- [ ] El historial de commits muestra el progreso del trabajo
- [ ] El archivo `.env` no está en el historial de Git (ya está en `.gitignore`)

---

## 📞 Dudas frecuentes

**¿Si formateo la PC pierdo los datos?**
No, los datos están en la base de datos Docker, no en el código. Solo hay que levantar `docker-compose up -d` nuevamente.

**¿Si formateo la PC pierdo el código?**
No, el código está en GitHub. Solo hay hacer `git clone` y volver a `npm install` y `npm run start:dev`.

**¿Necesito volver a migrar la BD si cambio algo en los entities?**
Con `synchronize: true` en `app.module.ts`, TypeORM actualiza automáticamente el schema. Pero en producción se recomienda usar migraciones (`npm run typeorm migration:run`).

---
---

**📌 Nota final:** Este README sirve como guía de uso y presentación del proyecto. El profesor lo revisará junto con el historial de commits y la colección Postman para evaluar el entregable.

---
*Historial generado el [fecha] para la entrega TP - Tecnologías Web (TUARI)*