import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Tamanio } from '../planta.entity';

export class QueryPlantaDto {
  @IsOptional()
  @IsString()
  clasificacion?: string;

  @IsOptional()
  @IsEnum(Tamanio)
  tamanio?: Tamanio;

  @IsOptional()
  @IsIn(['id', 'nombreCientifico', 'nombreVulgar', 'clasificacion', 'tamanio', 'epocaFloracion', 'origenId'])
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
