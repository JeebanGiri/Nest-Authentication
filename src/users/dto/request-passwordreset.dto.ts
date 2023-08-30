import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";
import * as Joi from 'joi';


export const requestForgetPasswordSchema = Joi.object({
    email: Joi.string().required()
})

export class RequestPasswordResetDto{
    @ApiProperty({
        description: 'Enter your email to reset your password',
        example: 'xyz@gmail.com'
    })
    @IsEmail()
    email: string;
}