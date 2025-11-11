import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReturnsController } from './returns.controller';
import { ReturnsService } from './returns.service';
import { Return, ReturnSchema } from './entities/return.entity';
import { OrdersModule } from '../sales/orders/orders.module';
import { OrderItem, OrderItemSchema } from '../sales/orders/entities/order-item.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Return.name, schema: ReturnSchema },
            { name: OrderItem.name, schema: OrderItemSchema },
        ]),
        OrdersModule,
    ],
    controllers: [ReturnsController],
    providers: [ReturnsService],
    exports: [ReturnsService],
})
export class ReturnsModule {}
