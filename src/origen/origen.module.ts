import { forwardRef, Module } from '@nestjs/common';
//import { origen} from './origen.entity';
import { OrigenController } from './origen.controller';
import { OrigenService } from './origen.service';
import { PlantaModule } from '../planta/planta.module';

@Module({
  imports: [forwardRef(() => PlantaModule)],
  controllers: [OrigenController],
  providers: [OrigenService],
  exports: [OrigenService],
})
export class OrigenModule {}
