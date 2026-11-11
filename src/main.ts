import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //NestFactory es un método de NestJS que permite crear una instancia de la aplicación.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //reconoce solo las propiedades definidas en los DTOs y descarta las demás.
      forbidNonWhitelisted: true, //lanza un error 400: Bad Request si se envían propiedades no definidas en los DTOs.
      transform: true, //transforma automáticamente los tipos de datos de las propiedades según lo definido en los DTOs.
    }),
  );
  app.enableCors();//sin esto el navegador bloquea la respuesta porque angular corre en localhost:4200 Y el backend en 3000
  await app.listen(process.env.PORT ?? 3000);
  //si no se especifica un puerto en las variables de entorno, se usará el puerto 3000 por defecto.
}
bootstrap().catch((err) => console.error(err));
//si nest no pudo iniciar la aplicación, se captura el error y se imprime en la consola.
