import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ReviewStatus } from '../entities/review.entity';
import { API_DESCRIPTIONS } from '../../../../../common/constants/api-descriptions';

export class ModerateReviewDto {
    @ApiProperty({
        enum: ReviewStatus,
        description: API_DESCRIPTIONS.REVIEW.STATUS,
    })
    @IsEnum(ReviewStatus)
    status: ReviewStatus;
}
