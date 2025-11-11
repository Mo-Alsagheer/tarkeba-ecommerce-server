import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, Min, Max, Length, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { API_DESCRIPTIONS, API_EXAMPLES } from '../../../../../common/constants/api-descriptions';

export class CreateReviewDto {
    @ApiProperty({
        description: API_DESCRIPTIONS.REVIEW.PRODUCT_ID,
        example: API_EXAMPLES.REVIEW.PRODUCT_ID,
    })
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    productId: string;

    @ApiProperty({
        description: API_DESCRIPTIONS.REVIEW.ORDER_ID,
        example: API_EXAMPLES.REVIEW.ORDER_ID,
    })
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    orderId: string;

    @ApiProperty({
        description: API_DESCRIPTIONS.REVIEW.RATING,
        example: API_EXAMPLES.REVIEW.RATING,
    })
    @IsNumber()
    @Min(1)
    @Max(5)
    @Type(() => Number)
    rating: number;

    @ApiProperty({
        description: API_DESCRIPTIONS.REVIEW.COMMENT,
        example: API_EXAMPLES.REVIEW.COMMENT,
    })
    @IsString()
    @IsNotEmpty()
    @Length(10, 1000)
    comment: string;
}
