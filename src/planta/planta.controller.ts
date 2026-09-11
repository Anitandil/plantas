import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { PlantaService } from './planta.service';
import { CreatePlantaDto } from './dto/create-planta.dto';
import { QueryPlantaDto } from './dto/query-planta.dto';

@Controller('planta') //'planta' es la ruta base para todas las rutas de este controlador
export class PlantaController {
  constructor(private readonly plantaService: PlantaService) {}

  @Get()
  findAll(@Query() query: QueryPlantaDto) {
    return this.plantaService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plantaService.findOne(+id);
  }

  @Post()
  create(@Body() createPlantaDto: CreatePlantaDto) {
    return this.plantaService.create(createPlantaDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() createPlantaDto: CreatePlantaDto) {
    return this.plantaService.update(+id, createPlantaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plantaService.remove(+id);
  }
}
