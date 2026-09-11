export class QueryPlantaDto {
  clasificacion?: string;
  tamanio?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
