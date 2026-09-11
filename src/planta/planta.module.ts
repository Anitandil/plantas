import { forwardRef, Module } from '@nestjs/common';
import { PlantaController } from './planta.controller';
import { PlantaService } from './planta.service';
import { OrigenModule } from '../origen/origen.module';

@Module({
  imports: [forwardRef(() => OrigenModule)],
  controllers: [PlantaController],
  providers: [PlantaService],
  exports: [PlantaService],
})
export class PlantaModule {}
