import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.origenService.remove(+id);
  }
}
