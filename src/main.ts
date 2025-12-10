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

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    const port = configService.get<number>('app.port', 3000);
    const frontendUrl = configService.get<string>('app.frontendUrl', 'http://localhost:3000');
    const nodeEnv = configService.get<string>('app.nodeEnv', 'development');

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
            origin: frontendUrl,
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
            whitelist: true, // Strip properties that don't have decorators
            forbidNonWhitelisted: true, // Throw error if non-whitelisted properties exist
            transform: true, // Auto-transform payloads to DTO instances
            transformOptions: {
                enableImplicitConversion: false, // Disable implicit type conversion for security
            },
            disableErrorMessages: nodeEnv === 'production', // Hide detailed errors in production
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
