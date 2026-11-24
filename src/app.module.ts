import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrigenModule } from './origen/origen.module';
import { PlantaModule } from './planta/planta.module';
import { Origen } from './origen/origen.entity';
import { Planta } from './planta/planta.entity';

//AppModule es el módulo raíz de la aplicación NestJS. 
// Se encarga de importar otros módulos, configurar servicios y 
// controladores, y establecer la conexión con la base de datos.
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        const useSsl = config.get<string>('DB_SSL') === 'true';

        return {
          type: 'postgres',
          ...(databaseUrl
            ? { url: databaseUrl }
            : {
                host: config.get<string>('DB_HOST'),
                port: Number(config.get<string>('DB_PORT') ?? 5432),
                username: config.get<string>('DB_USERNAME'),
                password: config.get<string>('DB_PASSWORD'),
                database: config.get<string>('DB_DATABASE'),
              }),
          ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
          entities: [Origen, Planta],
          synchronize: true,
        };
      },
    }),
    OrigenModule,
    PlantaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
