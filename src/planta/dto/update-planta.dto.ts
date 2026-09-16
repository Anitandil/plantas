import { Tamanio } from '../planta.entity';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePlantaDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombreCientifico?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombreVulgar?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  clasificacion?: string;

  @IsOptional()
  @IsEnum(Tamanio)
  tamanio?: Tamanio;

  @IsOptional()
  @IsString()
  epocaFloracion?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  origenId?: number;
}
