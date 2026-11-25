import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Origen } from '../origen/origen.entity';

export enum Clasificacion {
  ARBOL = 'Arbol',
  ARBUSTO = 'Arbusto',
  MATA = 'Mata',
  HIERBA = 'Hierba',
}

@Entity()
@Unique('UQ_planta_nombre_cientifico', ['nombreCientifico'])
export class Planta {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombreCientifico!: string;

  @Column()
  nombreVulgar!: string;

  @Column()
  clasificacion!: Clasificacion;

  @Column({ nullable: true })
  epocaFloracion?: string;

  @Column({ nullable: true })
  imagen?: string;

  @Column()
  origenId!: number;

  @ManyToOne(() => Origen)
  @JoinColumn({ name: 'origenId' })
  origen?: Origen;
}
