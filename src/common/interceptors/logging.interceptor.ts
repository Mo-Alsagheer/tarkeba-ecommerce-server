import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();
        const { method, url, ip } = request;
        const userAgent = request.get('user-agent') || '';
        const startTime = Date.now();

        this.logger.log(`Incoming: ${method} ${url} - ${ip} - ${userAgent}`);

        return next.handle().pipe(
            tap({
                next: () => {
                    const responseTime = Date.now() - startTime;
                    const response = context.switchToHttp().getResponse();
                    this.logger.log(
                        `Completed: ${method} ${url} - Status: ${response.statusCode} - ${responseTime}ms`
                    );
                },
                error: (error) => {
                    const responseTime = Date.now() - startTime;
                    this.logger.error(
                        `Failed: ${method} ${url} - Error: ${error.message} - ${responseTime}ms`
                    );
                },
            })
        );
    }
}
