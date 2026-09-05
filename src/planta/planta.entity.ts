export class Planta {
  id!: number;
  nombreCientifico!: string;
  nombreVulgar!: string;
  clasificacion!: string;
  tamanio!: string;
  epocaFloracion?: string; //pude ser strin o undefined porque no es un campo obligatorio
  origenId!: number;
}
