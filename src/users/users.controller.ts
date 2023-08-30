import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Get,
  Delete,
  Param,
  UseGuards,
  Request,
  Patch,
  ParseIntPipe,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger/dist';
import { User } from './entities/users.entity';
import { AuthGuard } from 'src/@Guard/auth.gard';
import {
  ChangePasswordDto,
  changePasswordSchema,
} from './dto/change-password.dto';
import {
  ForgetPasswordDto,
  forgetPasswordSchema,
} from './dto/forget-password.dto';
import {
  RequestPasswordResetDto,
  requestForgetPasswordSchema,
} from './dto/request-passwordreset.dto';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { JoiValidationPipe } from 'src/pipes/joi-validation.pipe';
import { JWTAuthGuard } from 'src/@Guard/jwt.authguard';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  @ApiOperation({ summary: 'Users created account..' })
  @ApiCreatedResponse({
    description: 'create a user sign up object..',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'You cannot signup Try Again',
  })
  @UsePipes(new JoiValidationPipe(createUserSchema))
  @ApiBody({ type: CreateUserDto }) // circular dependency
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.userService.signUp(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'get all users data.' })
  @ApiOkResponse({ type: User, isArray: true })
  @ApiOkResponse({ description: 'Getting all data sucessfully!' })
  @ApiBadRequestResponse({ description: 'Internal Server Errors..' })
  findAll() {
    return this.userService.findAll();
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Get an Id of user.' })
  @ApiResponse({ description: 'User sucessfully deleted.' })
  @ApiResponse({ description: 'User Not Found' })
  deleteData(@Param('id', new ParseIntPipe()) id: number) {
    return this.userService.deletedData(id);
  }

  @Get('/verifyotp/:code')
  @ApiOperation({ summary: 'get a otp Code..' })
  @ApiResponse({ status: 200, description: 'otp verification sucessfully' })
  @ApiResponse({ status: 404, description: 'User is not verified...' })
  verify(@Param('code', new ParseIntPipe()) code: number) {
    return this.userService.verifyOtp(code);
  }

  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({ summary: 'Enter the details to enter your profile..' })
  @ApiOkResponse({ description: 'User profile is unlock' })
  @ApiBadRequestResponse({ description: 'User not found.' })
  @ApiUnauthorizedResponse({ description: 'Unathorize and invalid token' })
  userProfile(@Request() req) {
    const user = req.user;
    console.log('profile', user);
    return user;
  }
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth('Auth')
  @Post('/changepassword')
  @UsePipes(new JoiValidationPipe(changePasswordSchema))
  @ApiBody({ type: ChangePasswordDto }) // circular dependency
  @ApiOperation({ summary: 'Change your password.' })
  @ApiOkResponse({ description: 'Password Change Sucessfully' })
  @ApiBadRequestResponse({ description: 'Invalid credentials match' })
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req) {
    return this.userService.changePassword(changePasswordDto, req.user);
  }

  @Post('/passwordreset')
  @UsePipes(new JoiValidationPipe(requestForgetPasswordSchema))
  @ApiBody({ type: RequestPasswordResetDto }) // circular dependency
  @ApiOperation({ summary: 'Request for password reset..' })
  @ApiCreatedResponse({ description: 'Password reset sucessfully!' })
  @ApiNotFoundResponse({ description: 'Invalid email' })
  RequestForPasswordReset(
    @Body() requestPasswordResetDto: RequestPasswordResetDto,
  ) {
    return this.userService.RequestForPasswordReset(requestPasswordResetDto);
  }

  @Patch('/resetPassword')
  @UsePipes(new JoiValidationPipe(forgetPasswordSchema))
  @ApiBody({ type: ForgetPasswordDto }) // circular dependency
  @ApiOperation({ summary: 'Reset Your Password..' })
  @ApiOkResponse({ description: 'Password Reset Sucessfully..' })
  @ApiBadRequestResponse({ description: 'Password do not Match...' })
  resetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.userService.resetPassword(forgetPasswordDto);
  }
}
