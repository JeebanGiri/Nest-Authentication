import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { User } from 'src/users/entities/users.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private authRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async signIn(signInDto: SignInDto): Promise<any> {
    try {
      const email = signInDto.email;
      const password = signInDto.password;
      const user = await this.authRepository.findOneBy({ email });
      if (!user.email) {
        throw new BadRequestException('Invalid Credentials match..');
      } else {
        console.log(user);
        if (user.isVerified == false) {
          throw new BadRequestException('Please Verify first with otp..');
        } else {
          const cmppassword = this.comparePassword(password, user?.password);
          if (!cmppassword) {
            throw new UnauthorizedException('Incorrect Password Enter..');
          }
          const users = { sub: user.id, email: user.email };
          return {
            jwt_token: await this.jwtService.signAsync(users),
          };
        }
      }
    } catch (e) {
      console.log('error', e);
    }
  }

  // async getToken(): Promise<any> {
  //   const user = new User();
  //   const users = { sub: user.id, email: user.email };
  //   console.log('token getting....'); // same action performs..
  //   return {
  //     jwt_token: await this.jwtService.signAsync(users),
  //   };
  // }

  // async generateJwt(user: User): Promise<string> { // same action perform..
  //   return this.jwtService.signAsync({ user });
  // }

  // verifyJwt(jwt: string): Promise<any> {
  //   return this.jwtService.verifyAsync(jwt);
  // }

  async bcryptPassword(password: string): Promise<string> {
    const securityRound = 10;
    const hashPassword = await bcrypt.hash(password, securityRound);
    return hashPassword;
  }
  
  async comparePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    const isMatched = await bcrypt.compare( password, hashPassword);
    return isMatched;
  }
}
