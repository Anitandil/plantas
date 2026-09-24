# Informe de la API de Plantas

## 1. Configuracion de Postman

Usar una variable de entorno:

```text
baseUrl = http://localhost:3000
```

Los requests se escriben como `{{baseUrl}}/planta` y `{{baseUrl}}/origen`.

## 2. Endpoints de plantas

| Metodo | Ruta | Funcion |
|---|---|---|
| GET | `/planta` | Listar plantas |
| GET | `/planta/:id` | Buscar una planta por ID |
| POST | `/planta` | Crear una planta |
| PATCH | `/planta/:id` | Actualizar uno o varios campos |
| DELETE | `/planta/:id` | Eliminar una planta |

### Consultas y filtros

La consulta es generica y sus parametros son opcionales.

```http
GET {{baseUrl}}/planta
GET {{baseUrl}}/planta?nombre=fic
GET {{baseUrl}}/planta?clasificacion=Arbol
GET {{baseUrl}}/planta?nombre=fic&clasificacion=Arbol
GET {{baseUrl}}/planta?sortBy=nombreCientifico&order=asc
GET {{baseUrl}}/planta?page=1&limit=2
```

`nombre` busca coincidencias parciales en el nombre cientifico y vulgar sin distinguir mayusculas y minusculas. `nombre` y `clasificacion` pueden combinarse, junto con la ordenacion y la paginacion.

### Crear una planta

```http
POST {{baseUrl}}/planta
```

```json
{
  "nombreCientifico": "Rosa gallica",
  "nombreVulgar": "Rosa",
  "clasificacion": "Arbusto",
  "epocaFloracion": "Primavera",
  "origenId": 1
}
```

Todos los campos son obligatorios excepto `epocaFloracion`. Se comprueba que el origen exista.

### Actualizar una planta

```http
PATCH {{baseUrl}}/planta/1
```

```json
{
  "nombreVulgar": "Ficus actualizado"
}
```

Se puede enviar cualquier campo por separado o varios campos juntos. `UpdatePlantaDto` usa `PartialType(CreatePlantaDto)`, por lo que reutiliza las validaciones y convierte todos los campos en opcionales.

### Eliminar una planta

```http
DELETE {{baseUrl}}/planta/1
```

Respuesta esperada:

```text
La planta con ID 1 fue eliminada correctamente.
```

## 3. Endpoints de origen

| Metodo | Ruta | Funcion |
|---|---|---|
| GET | `/origen` | Listar origenes |
| GET | `/origen/:id` | Buscar un origen por ID |
| POST | `/origen` | Crear un origen |
| DELETE | `/origen/:id` | Eliminar un origen |

### Crear un origen

```http
POST {{baseUrl}}/origen
```

```json
{
  "region": "Europa",
  "clima": "Templado"
}
```

Se comprueba que los campos no esten vacios y que no se repita la combinacion de region y clima.

### Eliminar un origen

```http
DELETE {{baseUrl}}/origen/4
```

Un origen con plantas asociadas no puede eliminarse. En ese caso se devuelve `409 Conflict`.

## 4. Validaciones

Las validaciones se definen en los DTO mediante `class-validator`.

### CreatePlantaDto

- `nombreCientifico`, `nombreVulgar` y `clasificacion`: texto y no vacios.
- `epocaFloracion`: texto opcional.
- `origenId`: numero entero y obligatorio.

### UpdatePlantaDto

Es parcial mediante `PartialType`. Todos los campos son opcionales, pero si se envia un campo se valida con las reglas de `CreatePlantaDto`.

### CreateOrigenDto

- `region`: texto y no vacio.
- `clima`: texto y no vacio.

### Errores para probar en Postman

- ID inexistente: `404 Not Found`.
- ID no numerico, por ejemplo `/planta/abc`: `400 Bad Request`.
- Campo obligatorio vacio: `400 Bad Request`.
- Clasificacion invalida: `400 Bad Request`.
- Campo no declarado en el DTO: `400 Bad Request`.
- Origen repetido: `409 Conflict`.
- Origen con plantas asociadas: `409 Conflict`.

## 5. ValidationPipe global

En `src/main.ts` se usa:

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

`ValidationPipe` aplica las validaciones de todos los DTO sin repetir configuracion en cada controlador.

- `whitelist: true`: permite solo propiedades declaradas en el DTO.
- `forbidNonWhitelisted: true`: rechaza propiedades desconocidas.
- `transform: true`: transforma los valores al tipo indicado.

## 6. ParseIntPipe y class-transformer

`ParseIntPipe` se usa en los controladores para los parametros `:id` de la URL:

```ts
import { ParseIntPipe } from '@nestjs/common';

@Param('id', ParseIntPipe) id: number
```

Convierte el ID a entero y rechaza valores como `abc`.

`class-transformer` se usa dentro de los DTO para transformar propiedades:

```ts
import { Type } from 'class-transformer';

@Type(() => Number)
@IsInt()
origenId: number;
```

La diferencia es que `ParseIntPipe` transforma un parametro individual de la ruta, mientras que `class-transformer` transforma propiedades de un body o query.

## 7. Pruebas recomendadas en Postman

Organizar la coleccion en:

```text
Plantas
  Listar plantas
  Buscar planta por ID
  Buscar por nombre parcial
  Filtrar por clasificacion
  Combinar filtros
  Ordenar y paginar
  Crear planta
  Actualizar planta
  Eliminar planta

Origenes
  Listar origenes
  Buscar origen por ID
  Crear origen
  Crear origen duplicado
  Eliminar origen sin plantas
  Intentar eliminar origen asociado

Validaciones
  ID invalido
  Campo vacio
  Clasificacion invalida
  Campo desconocido
```

Los datos se almacenan en PostgreSQL mediante TypeORM. La conexion se configura con las variables de entorno usadas por `app.module.ts` y los datos permanecen despues de reiniciar el servidor.