import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export default class forgetPasswordValidation {
  
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  constructor(data: Partial<forgetPasswordValidation>) {
    Object.assign(this, data);
  }
}
