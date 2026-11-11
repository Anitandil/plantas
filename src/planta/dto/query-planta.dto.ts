import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Clasificacion } from '../planta.entity';

export class QueryPlantaDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsEnum(Clasificacion)
  clasificacion?: Clasificacion;

  @IsOptional()
  @IsIn([
    'id',
    'nombreCientifico',
    'nombreVulgar',
    'clasificacion',
    'epocaFloracion',
    'origenId',
  ])
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

  @IsOptional()
  @IsIn(['short', 'full'])
  format?: 'short' | 'full';
}
