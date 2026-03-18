import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import * as express from 'express';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    const port = configService.get<number>('app.port', 3000);
    const frontendUrl = configService.get<string>('app.frontendUrl', 'http://localhost:3000');
    const nodeEnv = configService.get<string>('app.nodeEnv', 'development');

    const allowedOrigins = frontendUrl.split(',').map(url => url.trim());
    const vercelClient = 'https://tarkeba-ecommerce-client.vercel.app';
    if (!allowedOrigins.includes(vercelClient)) {
        allowedOrigins.push(vercelClient);
    }

    // Increase body size limit for file uploads
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.use(cookieParser());

    // Security middleware - Enhanced Helmet with CSP
    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", 'data:', 'https:'],
                },
            },
            crossOriginEmbedderPolicy: false,
        })
    );

    // CORS configuration with specific methods and headers
    app.use(
        cors({
            origin: allowedOrigins,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        })
    );

    // Prevent HTTP Parameter Pollution attacks
    app.use(hpp());

    // Global exception filter
    app.useGlobalFilters(new HttpExceptionFilter());

    // Global interceptors
    app.useGlobalInterceptors(new LoggingInterceptor(), new TimeoutInterceptor());

    // Global validation pipe with enhanced security
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: false,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            // Return field-level errors in all environments (safe — no stack traces)
            exceptionFactory: (errors) => {
                const messages = errors.map((err) => ({
                    field: err.property,
                    errors: Object.values(err.constraints || {}),
                }));
                const { BadRequestException } = require('@nestjs/common');
                return new BadRequestException(messages);
            },
        })
    );

    // API prefix
    app.setGlobalPrefix('api');

    // Swagger documentation
    if (nodeEnv !== 'production') {
        const config = new DocumentBuilder()
            .setTitle('Tarkeba E-commerce API')
            .setDescription(
                'Production-ready e-commerce backend with NestJS, TypeScript, and MongoDB'
            )
            .setVersion('1.0')
            .addBearerAuth()
            .addTag('auth', 'Authentication endpoints')
            .addTag('products', 'Product management')
            .addTag('categories', 'Category management')
            .addTag('orders', 'Order management')
            .addTag('coupons', 'Coupon management')
            .addTag('reviews', 'Review management')
            .addTag('payments', 'Payment processing')
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api/docs', app, document);
    }

    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

void bootstrap();
