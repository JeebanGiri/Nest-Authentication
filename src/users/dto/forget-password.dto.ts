import { IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import * as Joi from 'joi';

export const forgetPasswordSchema = Joi.object({
  otp: Joi.number().required(),
  newPassword: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});

export class ForgetPasswordDto {
  @ApiProperty({
    description: 'Enter the otp',
    example: 'XXXX',
  })
  @IsNotEmpty()
  @IsNumber()
  otp: number;

  @ApiProperty({
    description: 'Setup new password',
    example: 'new password',
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @ApiProperty({
    description: 'Confirm new password',
    example: 'new password',
  })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}
