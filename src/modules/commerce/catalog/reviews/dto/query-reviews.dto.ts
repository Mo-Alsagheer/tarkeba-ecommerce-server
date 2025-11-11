import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsNumber, Min, Max, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { ReviewStatus } from '../entities/review.entity';
import { API_DESCRIPTIONS, API_EXAMPLES } from '../../../../../common/constants/api-descriptions';
import { SortOrder } from '../../../../../common/enums';

export class QueryReviewsDto {
    @ApiProperty({
        description: API_DESCRIPTIONS.QUERY.PAGE,
        example: API_EXAMPLES.QUERY.PAGE,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiProperty({
        description: API_DESCRIPTIONS.QUERY.LIMIT,
        example: API_EXAMPLES.QUERY.LIMIT,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @ApiProperty({
        description: API_DESCRIPTIONS.REVIEW.PRODUCT_ID,
        example: API_EXAMPLES.REVIEW.PRODUCT_ID,
        required: false,
    })
    @IsOptional()
    @IsString()
    @IsMongoId()
    productId?: string;

    @ApiProperty({
        description: API_DESCRIPTIONS.REVIEW.USER_ID,
        example: API_EXAMPLES.REVIEW.USER_ID,
        required: false,
    })
    @IsOptional()
    @IsString()
    @IsMongoId()
    userId?: string;

    @ApiProperty({
        enum: ReviewStatus,
        description: API_DESCRIPTIONS.REVIEW.STATUS,
        required: false,
    })
    @IsOptional()
    @IsEnum(ReviewStatus)
    status?: ReviewStatus;

    @ApiProperty({
        description: API_DESCRIPTIONS.REVIEW.RATING,
        example: API_EXAMPLES.REVIEW.RATING,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(5)
    rating?: number;

    @ApiProperty({
        description: API_DESCRIPTIONS.REVIEW.SORT_BY,
        enum: SortOrder,
        required: false,
    })
    @IsOptional()
    @IsEnum(SortOrder)
    sortBy?: SortOrder;

    @ApiProperty({
        description: API_DESCRIPTIONS.REVIEW.SORT_ORDER,
        enum: SortOrder,
        required: false,
    })
    @IsOptional()
    @IsEnum(SortOrder)
    sortOrder?: SortOrder = SortOrder.DESC;
}
