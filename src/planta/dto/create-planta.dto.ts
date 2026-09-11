import { Tamanio } from '../planta.entity';

export class CreatePlantaDto {
  nombreCientifico: string;
  nombreVulgar: string;
  clasificacion: string;
  tamanio: Tamanio;
  epocaFloracion?: string;
  origenId: number;
}
