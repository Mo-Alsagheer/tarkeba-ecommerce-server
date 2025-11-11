import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { CouponsModule } from './coupons/coupons.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';

/**
 * SalesModule - Sales and checkout functionality
 *
 * This module groups sales-related functionality:
 * - Cart (add to cart, update quantities)
 * - Coupons (discounts, validation)
 * - Orders (order creation, tracking)
 * - Payments (payment processing, webhooks)
 */
@Module({
    imports: [CartModule, CouponsModule, OrdersModule, PaymentsModule],
    exports: [CartModule, CouponsModule, OrdersModule, PaymentsModule],
})
export class SalesModule {}
