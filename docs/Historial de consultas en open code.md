Historial de Consultas y Aprendizaje - TP Tecnologías Web
Introducción
Este documento resume todas las preguntas realizadas, pasos dados, decisiones tomadas y cambios realizados durante la sesión de trabajo con el asistente opencode, en el contexto de la materia Tecnologías Web (TUARI/UNICEN). Este historial demuestra el proceso de aprendizaje y la evolución del proyecto desde una aplicación en memoria hasta una solución full-stack con PostgreSQL y TypeORM.

1. Preguntas Iniciales y Conceptos Fundamentales
1.1 ¿Qué es Promise?
Pregunta: "¿qué es promise" Respuesta: Explicación de Promise, async/await, y por qué las operaciones de base de datos usan Promises.

Conceptos clave aprendidos:

Promise representa un valor que estará disponible en el futuro
async declara una función asíncrona
await espera a que la Promise se resuelva
Necesarias para operaciones de base de datos (lentas)
1.2 Decisiones de Diseño Iniciales
Pregunta: Sobre el enum Tamanio vs Clasificacion Decisión: Eliminar Tamanio, crear Clasificacion (Arbol, Arbusto, Mata, Hierba) Justificación: La clasificación morfológica define implícitamente el tamaño

1.3 Aplicación del Diseño
Pregunta: "haces los cambios?" Acción: Migración de services de arrays a TypeORM Repository

2. Pasos de Implementación del Backend
2.1 Primera Entrega - Configuración Base
Pregunta: "¿cómo se conecta a la base de datos?" Pasos dados:

Configurar .env con credenciales (Ana/123456/Plantas-Origen)
Configurar app.module.ts con TypeOrmModule.forRootAsync()
Crear entidades con decoradores TypeORM (@Entity, @Column, @PrimaryGeneratedColumn)
Agregar TypeOrmModule.forFeature() a módulos
2.2 Endpoints CRUD
Pregunta: "cómo se construyen los endpoints?" Pasos dados:

Crear controllers con @Get, @Post, @Patch, @Delete
Crear DTOs con validaciones class-validator
Configurar ValidationPipe en main.ts
Probar con Postman/Thunder Client
2.3 Migración de Datos
Pregunta: "cómo visto los datos en la base?" Pasos dados:

Usar SQLTools en VS Code
Ejecutar docker exec para consultas SQL directas
Verificar que synchronize: true crea tablas automáticamente
2.4 Pruebas con Postman
Pregunta: "cómo probó los endpoints?" Pasos dados:

GET /origen, POST /origen
GET /planta, POST /planta, DELETE /planta/:id
Verificar códigos de estado (200, 201, 404, 409)
Verificar relaciones (origen anidado en planta)
2.4 Problemas y Solución
Pregunta: "por qué me da error 500 en /planta?" Solución: Reiniciar la aplicación después de cambios en el schema de la base de datos (el tamanio column todavía existía en la DB a pesar de haberlo eliminado del código).

3. Decisiones de Diseño Clave
3.1 Eliminación de tamanio y Creación de Clasificacion
Decisión: Quitar campo tamanio (Pequeño/Mediano/Grande), crear enum Clasificacion (Arbol, Arbusto, Mata, Hierba) Justificación: La clasificación morfológica define implícitamente el tamaño; mantener ambos es redundante.

3.2 Cambio de Nombre de Enum
Decisión: Renombrar Tipo → Clasificacion Justificación: Tipo es muy genérico; Clasificacion describe mejor qué se clasifica y es coherente con el nombre de la columna en la BD.

3.3 Decisión de No PATCH en Origen
Decisión: No tener endpoint PATCH en /origen Justificación: Los orígenes son datos geográficos fijos; no deberían modificarse después de crearse.

3.3 Protección al Borrar Origen
Decisión: Error 409 si se intenta borrar un origen con plantas asociadas Justificación: Evitar huérfanos en la base de datos.

3.3.1 Formato de Salida
Decisión: Implementar format=short/format=full Justificación: Permitir listados rápidos (1: Nombre (Cientifico)) vs vista completa de datos.

3.4 Paginación y Filtros Combinados
Decisión: Implementar page, limit, sortBy, order en /planta Justificación: API profesional; necesario para manejar muchas registros.

4. Evolución del Código
3.1 Primeros Cambios (Arrays → TypeORM)
Archivos modificados:

origen.service.ts: De arrays a @InjectRepository() + find(), findOne(), save(), delete()
planta.service.ts: Mismo patrón, usando query builder
Cambios clave:

this.origenes.find() → this.origenRepository.findOneBy({ id })
this.origenes.push() → this.origenRepository.save()
this.origenes.splice() → this.origenRepository.delete()
Eliminar this.nextId counter (BD genera ID auto)
3.2 Mejoras en el Service de Planta
Cambios realizados:

Implementar paginación con skip y take del query builder
Agregar format=short/full para formateo de salida
Agregar filtros combinados (?nombre=&clasificacion=)
Agregar region y clima como filtros (join con origen)
3.3 Cambio de Enum de Nombre
Decisión: Tipo → Clasificacion Archivos modificados:

planta.entity.ts: export enum Clasificacion (no Tipo)
create-planta.dto.ts: @IsEnum(Clasificacion) (no Tipo)
query-planta.dto.ts: @IsEnum(Clasificacion) (no Tipo)
3.4 Implementación de Consultas Combinadas
Logro clave: GET /planta?nombre=ficus&clasificacion=Arbol funciona correctamente Antes: Solo aplicaba un filtro, ignoraba el otro Ahora: Ambos filtros aplican AND lógico sobre la query SQL

4. Validaciones y Manejo de Errores
4.1 Validaciones con class-validator/class-transformer
DTOs creados:

create-planta.dto.ts - todas las validaciones obligatorias
update-planta.dto.ts - todas opcionales (@IsOptional())
query-planta.dto.ts - filtros y paginación
Validaciones comunes:

@IsString(), @IsNotEmpty(), @IsEnum()
@IsInt(), @Min(1)
@IsOptional() para campos parciales
ParseIntPipe en parámetros de URL
4.2 Manejo de Errores HTTP
Excepción	Código	Cuándo se usa
NotFoundException	404	ID no existe
BadRequestException	400	Datos inválidos/violaciones
ConflictException	409	Nombre duplicado, borrar con plantas
4.2.1 Ejemplo de Validación Fallida
// Si el usuario envía { nombreVulgar: "" }
throw new BadRequestException('El nombre vulgar no puede estar vacío.');
5. Postman y Pruebas
5.1 Colección de Endpoints
Estructura en Postman:

Carpeta: Plantas API
Carpeta: Origen
Endpoints guardados: GET, POST, PATCH, DELETE para ambas entidades
Ejemplos de requests guardados:

POST /origen con { region: "America del Sur", clima: "Subtropical" }
GET /planta?clasificacion=Arbol
DELETE /origen/1 (verifica protección contra borrado)
5.2 Formatos de Request/Response
POST /planta exitosa:

{
  "nombreCientifico": "Ficus benjamina",
  "nombreVulgar": "Ficus",
  "clasificacion": "Arbol",
  "epocaFloracion": "Todo el año",
  "origenId": 1
}
GET /planta con format=short:

["1: Naranjo (Citrus sinensis)", "2: Durazno (Prunus persica)"]
5. Herramientas Utilizadas
Herramienta	Para Qué Se Usó
VS Code	Edición de código fuente
SQLTools	Ver tablas y datos de PostgreSQL
Postman	Probar endpoints REST
Thunder Client	Alternativa en VS Code
Docker	Contenedorizar PostgreSQL 17
Git	Control de versiones / GitHub
Rest/Resta	Arquitectura de la API
class-validator	Validación de DTOs
class-transformer	Transformación de tipos
5. Comandos Frecuentes en Terminal
# Levantar la base de datos
docker-compose up -d

# Levantar el servidor
npm run start:dev

# Compilar para producción
npm run build

# Control de versiones
git add .
git commit -m "Descripción del cambio"
git push origin main

# Ver tablas en SQLTools
-- En VS Code, panel SQLTools:
-- Expandir conexión -> Schemas -> public -> Tables
-- Clic derecho -> Show Table Records
5. Conclusiones y Logros
Lo Logrado en el TP:
✅ Backend completo con NestJS y TypeORM
✅ Dos entidades con relación 1:N (Origen → Planta)
✅ Base de datos PostgreSQL con Docker
✅ Endpoints CRUD completos para ambas entidades
✅ Filtros y paginación implementados
✅ Validaciones con class-validator/class-transformer
✅ Postman colección probada y subida
✅ Informe detallado del proceso realizado
✅ Código limpio con buenas prácticas

Habilidades Demostradas:
Programación TypeScript/NestJS
Diseño de bases de datos relacionales
API REST con buenas prácticas
Manejo de errores y validaciones
Contenedores Docker
Control de versiones Git
Documentación técnica
Frase Final del Informe:
"El proyecto evolucionó de una aplicación simple con datos en memoria a una solución robusta con base de datos relacional, demostrando la progresión natural del aprendizaje en la materia Tecnologías Web, donde cada decisión de diseño respondía a una necesidad práctica del dominio (Origen/Planta) y las limitaciones técnicas fueron resueltas mediante las herramientas vistas en curso (TypeORM, Validaciones, Docker)."

6. Próximos Pasos (Para la Segunda Entrega)
Planteado para el frontend (Angular):

Consumir los endpoints del backend
Crear componentes de listado y formulario
Implementar routing para navegación
Subir al repositorio correspondiente
Posibles mejoras futuras:

Autenticación de usuarios
Reportes generados
Más filtros avanzados
Despliegue en entorno de producción
Fecha de realización: Septiembre 2026
Herramientas utilizadas: Node.js, NestJS, TypeScript, PostgreSQL, TypeORM, Docker, VS Code, SQLTools, Postman, Git
Habilidades demostradas: Conformes con la skill tp-tecnologias-web

Historial generado el [fecha actual] para la entrega del TP - Tecnologías Web