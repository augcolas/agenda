import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface GrpcError {
  code: number;
  message: string;
}

@Injectable()
export class GrpcErrorInterceptor<T> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    return next.handle().pipe(
      catchError((error: unknown) => {
        if (this.isGrpcError(error)) {
          switch (error.code) {
            case 3: {
              throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
            }
            case 5: {
              throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
            }
            case 7: {
              throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
            }
            case 16: {
              throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
            }
            default: {
              throw new HttpException(
                error.message || 'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
            }
          }
        }

        return throwError(() => error);
      }),
    );
  }

  private isGrpcError(error: unknown): error is GrpcError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      'message' in error
    );
  }
}
