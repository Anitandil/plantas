import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Origen } from '../origen/origen.entity';

@Entity()
export class Planta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombreCientifico: string;

  @Column()
  nombreVulgar: string;

  @Column()
  clasificacion: string;

  @Column({ nullable: true })
  epocaFloracion?: string;

  @Column()
  tamanio: string;

  @ManyToOne(() => Origen, (origen) => origen.plantas)
  origen: Origen;
}
