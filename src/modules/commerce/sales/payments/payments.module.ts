import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment, PaymentSchema } from './entities/payment.entity';
import { PaymobService } from './services/paymob.service';
import { OrdersModule } from '../orders/orders.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
        HttpModule,
        OrdersModule,
    ],
    controllers: [PaymentsController],
    providers: [PaymentsService, PaymobService],
    exports: [PaymentsService, PaymobService],
})
export class PaymentsModule {}
