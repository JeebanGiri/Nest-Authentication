import { Transform } from 'class-transformer';
import { IsString, MinLength } from '@nestjs/class-validator';
import { IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { UsersService } from '../users.service';
import * as Joi from 'joi';

export const createUserSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required()

})

export class CreateUserDto {
  constructor(private usersService: UsersService) {}
  @ApiProperty({
    description: 'Users Emails.',
    example: 'jeebangiri942@gmail.com',
  })
  @IsString()
  @MinLength(3)
  @Transform(({ value }) => value.trim())
  email: string;

  @ApiProperty({
    description: 'Users Password',
    example: 'Jeeban@123456',
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
