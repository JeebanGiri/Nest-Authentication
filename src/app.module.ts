import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/users.entity';
import { MessagesModule } from './messages/messages.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from './auth/intereceptors/users.interceptors';
@Module({
  imports: [
    TypeOrmModule.forRootAsync(
      {
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        username: process.env.DB_USERNAME || 'wrl',
        password: process.env.DB_PASSWORD || 'internship',
        database: process.env.DB_DATABASE || 'authentication',
        entities: [User], // entity classes
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    MessagesModule,
  ],
  controllers: [AppController],
  // when we import this intercept, we can use this as a global and it also support the dependency.
  providers: [AppService,
    {provide: APP_INTERCEPTOR, useClass: UserInterceptor}   
  ],
})
export class AppModule {}

// entities: [join(process.cwd(), 'dist/**/*.entity.js')],
