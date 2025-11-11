import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cors from 'cors';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    const port = configService.get<number>('app.port', 3000);
    const frontendUrl = configService.get<string>('app.frontendUrl', 'http://localhost:3000');
    const nodeEnv = configService.get<string>('app.nodeEnv', 'development');

    // Security middleware
    app.use(helmet());
    app.use(
        cors({
            origin: frontendUrl,
            credentials: true,
        })
    );

    // Global exception filter
    app.useGlobalFilters(new HttpExceptionFilter());

    // Global interceptors
    app.useGlobalInterceptors(new LoggingInterceptor(), new TimeoutInterceptor());

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
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
