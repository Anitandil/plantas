import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrigenController } from './origen.controller';
import { OrigenService } from './origen.service';
import { Origen } from './origen.entity';
import { PlantaModule } from '../planta/planta.module';

@Module({
  imports: [forwardRef(() => PlantaModule), TypeOrmModule.forFeature([Origen])],
  controllers: [OrigenController],
  providers: [OrigenService],
  exports: [OrigenService],
})
export class OrigenModule {}
