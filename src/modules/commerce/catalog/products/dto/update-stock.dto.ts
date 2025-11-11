import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { UPDATE_STOCK_SWAGGER } from '../../../../../common/constants/products-swagger.constants';

export class UpdateStockDto {
    @ApiProperty(UPDATE_STOCK_SWAGGER.quantity)
    @IsNumber()
    quantity: number;

    @ApiProperty(UPDATE_STOCK_SWAGGER.size)
    @IsString()
    size: string;
}
