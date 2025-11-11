import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
    statusCode: number;
    timestamp: string;
    path: string;
    method: string;
    message: string | string[];
    error?: string;
    stack?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | string[] = 'Internal server error';
        let error = 'Internal Server Error';

        // Handle HTTP exceptions
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object') {
                const responseObj = exceptionResponse as any;
                message = responseObj.message || message;
                error = responseObj.error || exception.name;
            }
        } else if (exception instanceof Error) {
            // Handle generic errors
            message = exception.message;
            error = exception.name;
        }

        const errorResponse: ErrorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message,
            error,
        };

        // Add stack trace in development
        if (process.env.NODE_ENV !== 'production' && exception instanceof Error) {
            errorResponse.stack = exception.stack;
        }

        // Log the error
        this.logger.error(
            `${request.method} ${request.url} - Status: ${status}`,
            exception instanceof Error ? exception.stack : JSON.stringify(exception)
        );

        // Send response
        response.status(status).json(errorResponse);
    }
}
