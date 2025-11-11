import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductsModule } from '../../catalog/products/products.module';
import { CouponsModule } from '../coupons/coupons.module';

@Module({
    imports: [ProductsModule, CouponsModule],
    controllers: [CartController],
    providers: [CartService],
    exports: [CartService],
})
export class CartModule {}
