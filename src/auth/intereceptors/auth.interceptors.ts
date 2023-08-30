import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

export class AuthInterceptors implements NestInterceptor {      
  // in order to make this as a global, we need to use them in two cases:
  // 1. Main.ts file
  // 2. module file like app.module or any other module.
  // [Note:] = In the main.ts file, it only works when there in the interceptor file there doesnot contains any dependency like constructor 
  // otherwise it throws an errors.
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    request.body.name = 'Jeeban';
    request.body.age = 22;
    return next.handle().pipe(map((data) => {
        data = "from interceptors"
        return data;
    }));
  }
}
