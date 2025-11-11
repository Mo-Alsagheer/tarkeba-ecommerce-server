import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNumber, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
    STOCK_REDUCTION_ITEM_SWAGGER,
    REDUCE_STOCK_SWAGGER,
} from '../../../../../common/constants/products-swagger.constants';

export class StockReductionItemDto {
    @ApiProperty(STOCK_REDUCTION_ITEM_SWAGGER.productID)
    @IsMongoId()
    productID: string;

    @ApiProperty(STOCK_REDUCTION_ITEM_SWAGGER.quantity)
    @IsNumber()
    @Min(1)
    quantity: number;

    @ApiProperty(STOCK_REDUCTION_ITEM_SWAGGER.size)
    @IsString()
    size: string;
}

export class ReduceStockDto {
    @ApiProperty({ ...REDUCE_STOCK_SWAGGER.items, type: [StockReductionItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StockReductionItemDto)
    items: StockReductionItemDto[];
}
