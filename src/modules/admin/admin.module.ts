import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../identity/users/entities/user.entity';
import { Order, OrderSchema } from '../commerce/sales/orders/entities/order.entity';
import { Product, ProductSchema } from '../commerce/catalog/products/entities/product.entity';
import { RefreshToken, RefreshTokenSchema } from '../identity/auth/entities/refresh-token.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Order.name, schema: OrderSchema },
            { name: Product.name, schema: ProductSchema },
            { name: RefreshToken.name, schema: RefreshTokenSchema },
        ]),
    ],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService],
})
export class AdminModule {}
