import { Tamanio } from '../planta.entity';

export class UpdatePlantaDto {
  nombreCientifico?: string;
  nombreVulgar?: string;
  clasificacion?: string;
  tamanio?: Tamanio;
  epocaFloracion?: string;
  origenId?: number;
}