import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';
import { Coupon, CouponSchema } from './entities/coupon.entity';
import { CouponUsage, CouponUsageSchema } from './entities/coupon-usage.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Coupon.name, schema: CouponSchema },
            { name: CouponUsage.name, schema: CouponUsageSchema },
        ]),
    ],
    controllers: [CouponsController],
    providers: [CouponsService],
    exports: [CouponsService],
})
export class CouponsModule {}
