import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Review, ReviewSchema } from './entities/review.entity';
import { OrdersModule } from '../../sales/orders/orders.module';
import { ProductsModule } from '../products/products.module';
import { AuthModule } from '../../../identity/auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
        OrdersModule,
        ProductsModule,
        AuthModule,
    ],
    controllers: [ReviewsController],
    providers: [ReviewsService],
    exports: [ReviewsService],
})
export class ReviewsModule {}
