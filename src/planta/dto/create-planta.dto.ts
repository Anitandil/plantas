import { Tamanio } from '../planta.entity';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePlantaDto {
  @IsString()
  @IsNotEmpty()
  nombreCientifico: string;

  @IsString()
  @IsNotEmpty()
  nombreVulgar: string;

  @IsString()
  @IsNotEmpty()
  clasificacion: string;

  @IsEnum(Tamanio)
  tamanio: Tamanio;

  @IsOptional()
  @IsString()
  epocaFloracion?: string;

  @Type(() => Number)
  @IsInt()
  origenId: number;
}
