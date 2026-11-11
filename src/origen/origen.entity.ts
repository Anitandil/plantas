import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Origen {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  region!: string;

  @Column()
  clima!: string;
}
