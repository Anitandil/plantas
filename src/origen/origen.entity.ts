import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique('UQ_origen_region_clima', ['region', 'clima'])
export class Origen {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  region!: string;

  @Column()
  clima!: string;
}
