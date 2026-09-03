import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrigenModule } from './origen/origen.module';
import { PlantaModule } from './planta/planta.module';

@Module({
  imports: [OrigenModule, PlantaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
