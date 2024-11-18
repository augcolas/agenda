import { status } from '@grpc/grpc-js';
import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class RpcExceptionsInterceptor<T> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    return next.handle().pipe(
      catchError((error: unknown) => {
        if (error instanceof UnauthorizedException) {
          return throwError(
            () =>
              new RpcException({
                code: status.UNAUTHENTICATED,
                message: 'Unauthorized',
              }),
          );
        }
        if (error instanceof ForbiddenException) {
          return throwError(
            () =>
              new RpcException({
                code: status.PERMISSION_DENIED,
                message: 'Forbidden',
              }),
          );
        }

        return throwError(
          () =>
            new RpcException({
              code: status.INTERNAL,
              message:
                error instanceof Error ? error.message : 'Internal error',
            }),
        );
      }),
    );
  }
}
