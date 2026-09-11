import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Patch,
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

  @Post()
  create(@Body() createOrigenDto: CreateOrigenDto) {
    return this.origenService.create(createOrigenDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() createOrigenDto: CreateOrigenDto) {
    return this.origenService.update(+id, createOrigenDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.origenService.remove(+id);
  }
}
