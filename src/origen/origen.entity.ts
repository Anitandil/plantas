import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Planta } from '../planta/planta.entity';

@Entity()
export class Origen {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['Europa', 'Asia', 'Africa', 'Oceania', 'América del Norte', 'América Central', 'América del Sur'] })
  continente: string;

  @Column({ type: 'enum', enum: ['tropical', 'seco', 'templado', 'continental/frío', 'polar'] })
  clima: string;

  @OneToMany(() => Planta, (planta) => planta.origen)
  plantas: Planta[];
}
