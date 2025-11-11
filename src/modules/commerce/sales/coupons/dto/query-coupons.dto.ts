import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsNumber, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CouponType, CouponStatus } from '../entities/coupon.entity';
import { API_DESCRIPTIONS, API_EXAMPLES } from '../../../../../common/constants/api-descriptions';

export class QueryCouponsDto {
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
        enum: CouponStatus,
        description: API_DESCRIPTIONS.COUPON.STATUS,
        required: false,
    })
    @IsOptional()
    @IsEnum(CouponStatus)
    status?: CouponStatus;

    @ApiProperty({
        enum: CouponType,
        description: API_DESCRIPTIONS.COUPON.TYPE,
        required: false,
    })
    @IsOptional()
    @IsEnum(CouponType)
    type?: CouponType;

    @ApiProperty({ description: API_DESCRIPTIONS.COUPON.CODE, required: false })
    @IsOptional()
    @IsString()
    @Transform(({ value }: { value: string }) => value.toUpperCase().trim())
    code?: string;

    @ApiProperty({
        description: API_DESCRIPTIONS.QUERY.SEARCH,
        required: false,
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({
        description: API_DESCRIPTIONS.QUERY.ACTIVE_ONLY,
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    activeOnly?: boolean;
}
