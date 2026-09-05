import { Module } from '@nestjs/common';
import { PlantaController } from './planta.controller';
import { PlantaService } from './planta.service';
import { OrigenModule } from '../origen/origen.module';

@Module({
  imports: [OrigenModule],
  controllers: [PlantaController],
  providers: [PlantaService],
})
export class PlantaModule {}
