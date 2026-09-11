import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Patch,
  ConflictException,
} from '@nestjs/common';
import { OrigenService } from './origen.service';
import { CreateOrigenDto } from './dto/create-origen.dto';

@Controller('origen')
export class OrigenController {
  constructor(private readonly origenService: OrigenService) {}

  @Get()
  findAll() {
    return this.origenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.origenService.findOne(+id);
  }
  @Post()
  create(@Body() createOrigenDto: CreateOrigenDto) {
    return this.origenService.create(createOrigenDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() createOrigenDto: CreateOrigenDto) {
    if (
      typeof createOrigenDto.region !== 'string' ||
      createOrigenDto.region.trim() === '' ||
      typeof createOrigenDto.clima !== 'string' ||
      createOrigenDto.clima.trim() === ''
    ) {
      throw new ConflictException(
        'Los campos región y clima no pueden estar vacíos.',
      );
    }
    return this.origenService.update(+id, createOrigenDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.origenService.remove(+id);
  }
}
