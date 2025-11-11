import { IsOptional, IsString, IsBoolean, IsNumber, Min, Max, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CategorySortField, SortOrder } from '../../../../../common/enums';
import { CATEGORIES_SWAGGER_EXAMPLES } from '../../../../../common/constants';

export class QueryCategoryDto {
    @ApiPropertyOptional({
        description: 'Page number for pagination',
        default: 1,
        minimum: 1,
        example: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        description: 'Number of items per page',
        default: 10,
        minimum: 1,
        maximum: 100,
        example: 10,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @ApiPropertyOptional({
        description: 'Search term to filter categories by name or description',
        example: CATEGORIES_SWAGGER_EXAMPLES.CATEGORY_SLUG,
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        description: 'Filter by parent category ID (use "null" for root categories)',
        example: CATEGORIES_SWAGGER_EXAMPLES.MONGODB_OBJECT_ID,
    })
    @IsOptional()
    @IsString()
    parentID?: string;

    @ApiPropertyOptional({
        description: 'Filter by active status',
        example: true,
    })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({
        description: 'Field to sort by',
        enum: CategorySortField,
        default: CategorySortField.SORT_ORDER,
        example: CategorySortField.NAME,
    })
    @IsOptional()
    @IsEnum(CategorySortField)
    sortBy?: CategorySortField = CategorySortField.SORT_ORDER;

    @ApiPropertyOptional({
        description: 'Sort order direction',
        enum: SortOrder,
        default: SortOrder.ASC,
        example: SortOrder.ASC,
    })
    @IsOptional()
    @IsEnum(SortOrder)
    sortOrder?: SortOrder = SortOrder.ASC;
}
