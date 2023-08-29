import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export default class userValidation {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  constructor(data: Partial<userValidation>) {
    Object.assign(this, data);
  }
}
