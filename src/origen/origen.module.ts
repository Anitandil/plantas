import { Module } from '@nestjs/common';
//import { origen} from './origen.entity';
import { OrigenController } from './origen.controller';
import { OrigenService } from './origen.service';

@Module({
  controllers: [OrigenController],
  providers: [OrigenService],
  exports: [OrigenService],
})
export class OrigenModule {}
