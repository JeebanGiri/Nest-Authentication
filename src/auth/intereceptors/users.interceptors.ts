import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { tap } from "rxjs";
import { Request, Response } from "express";


@Injectable()
export class UserInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        const startTime = Date.now();

        return next.handle().pipe(tap(() =>{
            const endTime = Date.now();
            const resTime = endTime - startTime;

            console.log(
                `${request.method} ${request.path} ${response.statusCode} ${resTime}ms`
            )
        }) )

        }
}