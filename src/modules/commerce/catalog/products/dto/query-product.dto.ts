import { IsOptional, IsString, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { QUERY_PRODUCT_SWAGGER } from '../../../../../common/constants/products-swagger.constants';

export class QueryProductDto {
    @ApiPropertyOptional(QUERY_PRODUCT_SWAGGER.page)
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional(QUERY_PRODUCT_SWAGGER.limit)
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @ApiPropertyOptional(QUERY_PRODUCT_SWAGGER.search)
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional(QUERY_PRODUCT_SWAGGER.category)
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional(QUERY_PRODUCT_SWAGGER.minPrice)
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @ApiPropertyOptional(QUERY_PRODUCT_SWAGGER.maxPrice)
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maxPrice?: number;

    @ApiPropertyOptional(QUERY_PRODUCT_SWAGGER.isActive)
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional(QUERY_PRODUCT_SWAGGER.isFeatured)
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isFeatured?: boolean;

    @ApiPropertyOptional(QUERY_PRODUCT_SWAGGER.sortBy)
    @IsOptional()
    @IsString()
    sortBy?: string = 'createdAt';

    @ApiPropertyOptional(QUERY_PRODUCT_SWAGGER.sortOrder)
    @IsOptional()
    @IsString()
    sortOrder?: 'asc' | 'desc' = 'desc';
}
