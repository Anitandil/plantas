export enum Tamanio {
  PEQUENIO = 'Pequeño',
  MEDIANO = 'Mediano',
  GRANDE = 'Grande',
}

export class Planta {
  id!: number;
  nombreCientifico!: string;
  nombreVulgar!: string;
  clasificacion!: string;
  tamanio!: Tamanio;
  epocaFloracion?: string;
  origenId!: number;
}
