import { IsString, MinLength } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsStrongPassword } from 'class-validator';
import * as Joi from 'joi';


export const signInSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export class SignInDto {
  @ApiProperty({
    description: 'email',
    example: 'jeeban@gmail.com',
  })
  @IsString()
  @MinLength(3)
  @Transform(({ value }) => value.trim())
  email: string;

  @ApiProperty({
    description: 'Password',
    example: 'Jeeban@1234',
  })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;
}
