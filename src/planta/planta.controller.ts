import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PlantaService } from './planta.service';
import { CreatePlantaDto } from './dto/create-planta.dto';

@Controller('planta')
export class PlantaController {
  constructor(private readonly plantaService: PlantaService) {}

  @Get()
  findAll(@Query('clasificacion') clasificacion?: string) {
  return this.plantaService.findAll(clasificacion);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.plantaService.findOne(id);
  }

  @Post()
  create(@Body() createPlantaDto: CreatePlantaDto) {
    return this.plantaService.create(createPlantaDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() createPlantaDto: CreatePlantaDto,
  ) {
    return this.plantaService.update(id, createPlantaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.plantaService.remove(id);
  }
}
