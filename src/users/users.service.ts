import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { sendMail } from 'src/helper/mail';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestPasswordResetDto } from './dto/request-passwordreset.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private authRepository: Repository<User>,
    private authService: AuthService,
  ) {}
  async signUp(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto; // alternative way...
    const hashPassword = await this.authService.bcryptPassword(password);
    const user = new User();
    user.email = email;
    user.password = hashPassword;
    const otp = Math.floor(Math.random() * 10000);
    user.userOtp = otp;
    sendMail({
      to: email,
      subject: 'Welcome to Nice App! Confirm Email',
      text: `Your OTP is ${otp}`,
    });
    return await this.authRepository.save(user);
  }

  async findEmail(email: string, password: string): Promise<User | undefined> {
    return await this.authRepository.findOneBy({ email });
  }
  async findPassword(password: string): Promise<User | undefined> {
    return await this.authRepository.findOneBy({ password });
  }

  // async findById(id: number) {
  //   const payload = await this.authRepository.findOneBy({ id });
  //   return this.authService.generateJwt(payload);
  // }

  // Getting all data from repository..
  async findOne(datas: any): Promise<User> {
    return this.authRepository.findOne({
      where: { ...datas },
    });
  }

  async findAll(): Promise<User[] | undefined> {
    return await this.authRepository.find();
  }

  async deletedData(id: number) {
    const data = await this.authRepository.findOne({ where: { id: id } });
    return await this.authRepository.remove(data);
  }

  async verifyOtp(otpcode: number) {
    const userotp = await this.authRepository.findOne({
      where: { userOtp: otpcode },
    });
    if (!userotp) {
      throw new UnauthorizedException();
    } else {
      const isVerified = await this.authRepository.update(
        { userOtp: userotp.userOtp },
        { isVerified: true },
      );
      console.log(isVerified);
      console.log('User Verify');
      return isVerified;
    }
  }
  async changePassword(changePasswordDto: ChangePasswordDto, repdata:any) {
    try {
      let users = await this.findOne({ id: repdata['id'] });
      if (
        !(await this.authService.comparePassword(
          changePasswordDto.oldPassword,
          users.password,
        ))
      ) {
        return new BadRequestException('Invalid Old Password');
      }
      if (changePasswordDto.newPassword != changePasswordDto.confirmPassword) {
        return new BadRequestException('Password dont match..');
      } else {
        const passwordHashed = await this.authService.bcryptPassword(
          changePasswordDto.newPassword,
        );
        await this.authRepository.update(users.id, {
          password: passwordHashed,
        });

        return { message: 'Password change sucessfully..' };
      }
    } catch (e) {
      console.log(e, 'error');
      throw new BadRequestException(' Sorry!, Try Again...');
    }
  }

  
  async RequestForPasswordReset(
    requestPasswordResetDto: RequestPasswordResetDto,
  ) {
    const email = requestPasswordResetDto.email;

    const users = await this.findOne({ email: email });
    if (users) {
      const generatedOtp = Math.floor(Math.random() * 10000);
      users.userOtp = generatedOtp;
      sendMail({
        to: email,
        subject: 'Welcome to Nice App! Confirm Email',
        text: `Your OTP is ${generatedOtp}`,
      });
      return this.authRepository.save(users);
    } else {
      throw new UnauthorizedException('Invalid credentials enter...');
    }
  }

  async resetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const newOtp = forgetPasswordDto.otp;
    const users = await this.findOne({ otp: newOtp });
    if (users.userOtp != forgetPasswordDto.otp) {
      throw new BadRequestException('Invalid otp are found...');
    } else if (
      forgetPasswordDto.newPassword != forgetPasswordDto.confirmPassword
    ) {
      throw new BadRequestException(
        'Password dont match. check it and try again..',
      );
    } else {
      const passwordHashed = await this.authService.bcryptPassword(
        forgetPasswordDto.newPassword,
      );
      return await this.authRepository.update(users.id, {
        password: passwordHashed,
      });
    }
  }
}
