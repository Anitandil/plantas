import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrigenModule } from './origen/origen.module';
import { PlantaModule } from './planta/planta.module';
import { Origen } from './origen/origen.entity';
import { Planta } from './planta/planta.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        entities: [Origen, Planta],
        synchronize: true,
      }),
    }),
    OrigenModule,
    PlantaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
