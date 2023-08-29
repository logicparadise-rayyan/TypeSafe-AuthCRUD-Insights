import { IsNotEmpty, IsString } from 'class-validator';

export default class Validation {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  constructor(data: Partial<Validation>) {
    Object.assign(this, data);
  }
}
