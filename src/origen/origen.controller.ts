import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { OrigenService } from './origen.service';
import { CreateOrigenDto } from './dto/create-origen.dto';
import { UpdateOrigenDto } from './dto/update-origen.dto';

@Controller('origen')
export class OrigenController {
  constructor(private readonly origenService: OrigenService) {}

  @Get()
  findAll() {
    return this.origenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.origenService.findOne(id);
  }
  @Post()
  create(@Body() createOrigenDto: CreateOrigenDto) {
    return this.origenService.create(createOrigenDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrigenDto: UpdateOrigenDto,
  ) {
    return this.origenService.update(id, updateOrigenDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.origenService.remove(id);
  }
}
