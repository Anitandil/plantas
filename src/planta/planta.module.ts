import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantaController } from './planta.controller';
import { PlantaService } from './planta.service';
import { Planta } from './planta.entity';
import { OrigenModule } from '../origen/origen.module';

@Module({
  imports: [forwardRef(() => OrigenModule), TypeOrmModule.forFeature([Planta])],
  controllers: [PlantaController],
  providers: [PlantaService],
  exports: [PlantaService],
})
export class PlantaModule {}
