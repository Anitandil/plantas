import { Clasificacion } from '../planta.entity';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePlantaDto {
  @IsString()
  @IsNotEmpty()
  nombreCientifico: string;

  @IsString()
  @IsNotEmpty()
  nombreVulgar: string;

  @IsEnum(Clasificacion)
  @IsNotEmpty()
  clasificacion: Clasificacion;

  @IsOptional()
  @IsString()
  epocaFloracion?: string;

  @Type(() => Number)
  @IsInt()
  origenId: number;
}
