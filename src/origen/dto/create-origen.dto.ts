import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrigenDto {
  @IsString()
  @IsNotEmpty()
  region!: string;

  @IsString()
  @IsNotEmpty()
  clima!: string;
}
