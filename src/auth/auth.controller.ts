import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  UseInterceptors,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger/dist';
import { User } from 'src/users/entities/users.entity';
import { AuthInterceptors } from './intereceptors/auth.interceptors';
import { Request, Response } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiCreatedResponse({
    description: 'Created a user sign in object.',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'You cannot login. Try again..',
  })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  // Implement Interceptors  // we can implement this from a method or overall route controller
  @Post('/getfrombody')
  @UseInterceptors(AuthInterceptors)
  getFromBody(@Req() req: Request, @Res() res: Response) {
    return res.json(req.body);
  }

  @Post('/fromintercept')
  @UseInterceptors(AuthInterceptors)
  executeFromInterceptors(){
    return 'This is interceptors execute methos'
  }
}
