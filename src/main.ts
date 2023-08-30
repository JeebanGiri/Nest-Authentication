import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger/dist';
import { UserInterceptor } from './auth/intereceptors/users.interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Authentication User')
    .setDescription('The User API description')
    .setVersion('1.0')
    .addTag('User')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // when we import this intercept, we can use this as a global and it cannot support the dependency like the interceptor that contains constructor
  // app.useGlobalInterceptors(new UserInterceptor());
  
  await app.listen(3000);
}
bootstrap();
