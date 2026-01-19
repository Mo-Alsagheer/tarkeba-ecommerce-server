import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, OrderSchema } from './entities/order.entity';
import { OrderItem, OrderItemSchema } from './entities/order-item.entity';
import { QueueModule } from '../../../messaging/queue/queue.module';
import { ProductsModule } from '../../../commerce/catalog/products/products.module';
import { AuthModule } from '../../../identity/auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Order.name, schema: OrderSchema },
            { name: OrderItem.name, schema: OrderItemSchema },
        ]),
        QueueModule,
        ProductsModule,
        AuthModule,
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService],
})
export class OrdersModule {}
