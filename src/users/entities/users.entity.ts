import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('authentication')
export class User {
  @ApiProperty({ description: 'primary key as user Id,', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'email    ',
    example: ' jeeban.giri5995@gmail.com',
  })
  @Column()
  email: string;

  @ApiProperty({ description: ' hash user password' })
  @Column()
  password: string;

  @ApiProperty({ description: 'verfication status..' })
  @Column({ default: false, nullable: true })
  isVerified: boolean;

  @ApiProperty({ description: 'Otp code' })
  @Column()
  userOtp: number;

  @ApiProperty({description: 'Created User date'})
  @CreateDateColumn({ select: false})
  createdAt: Date
}
