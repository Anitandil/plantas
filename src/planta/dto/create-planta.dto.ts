import { Tipo } from '../planta.entity';
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

  @IsEnum(Tipo)
  @IsNotEmpty()
  clasificacion: Tipo;

  @IsOptional()
  @IsString()
  epocaFloracion?: string;

  @Type(() => Number)
  @IsInt()
  origenId: number;
}
