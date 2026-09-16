import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PlantaService } from './planta.service';
import { CreatePlantaDto } from './dto/create-planta.dto';
import { UpdatePlantaDto } from './dto/update-planta.dto';
import { QueryPlantaDto } from './dto/query-planta.dto';

@Controller('planta') //'planta' es la ruta base para todas las rutas de este controlador
export class PlantaController {
  constructor(private readonly plantaService: PlantaService) {}

  @Get()
  findAll(@Query() query: QueryPlantaDto) {
    return this.plantaService.findAll(query);
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
    @Body() updatePlantaDto: UpdatePlantaDto,
  ) {
    return this.plantaService.update(id, updatePlantaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.plantaService.remove(id);
  }
}
