import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsMongoId,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
    STOCK_VALIDATION_ITEM_SWAGGER,
    VALIDATE_STOCK_SWAGGER,
} from '../../../../../common/constants/products-swagger.constants';

export class StockValidationItemDto {
    @ApiProperty(STOCK_VALIDATION_ITEM_SWAGGER.productID)
    @IsMongoId()
    productID: string;

    @ApiProperty(STOCK_VALIDATION_ITEM_SWAGGER.quantity)
    @IsNumber()
    @Min(1)
    quantity: number;

    @ApiPropertyOptional(STOCK_VALIDATION_ITEM_SWAGGER.size)
    @IsOptional()
    @IsString()
    size?: string;
}

export class ValidateStockDto {
    @ApiProperty({ ...VALIDATE_STOCK_SWAGGER.items, type: [StockValidationItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StockValidationItemDto)
    items: StockValidationItemDto[];
}
