import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../../../common/enums';

export class UpdateOrderStatusDto {
    @ApiProperty({
        description: 'New order status',
        enum: OrderStatus,
        example: OrderStatus.PROCESSING,
    })
    @IsEnum(OrderStatus)
    @IsNotEmpty()
    status: OrderStatus;
}
