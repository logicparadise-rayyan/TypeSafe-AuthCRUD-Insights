import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export default class signUpValidation {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  constructor(data: Partial<signUpValidation>) {
    Object.assign(this, data);
  }
}
