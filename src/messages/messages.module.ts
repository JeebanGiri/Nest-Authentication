import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule], 
  providers: [MessagesGateway, MessagesService, JwtStrategy],
  controllers: [],
  exports: [MessagesService]
})
export class MessagesModule {}
