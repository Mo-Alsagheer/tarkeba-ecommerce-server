import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment, PaymentSchema } from './entities/payment.entity';
import { PaymobService } from './services/paymob.service';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from '../../catalog/products/products.module';
import { AuthModule } from '../../../identity/auth/auth.module';
import { User, UserSchema } from '../../../identity/users/entities/user.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Payment.name, schema: PaymentSchema },
            { name: User.name, schema: UserSchema },
        ]),
        HttpModule,
        OrdersModule,
        ProductsModule,
        AuthModule,
    ],
    controllers: [PaymentsController],
    providers: [PaymentsService, PaymobService],
    exports: [PaymentsService, PaymobService],
})
export class PaymentsModule {}
