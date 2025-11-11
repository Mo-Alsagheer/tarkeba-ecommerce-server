import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { ReturnStatus } from '../../../../common/enums/return.enum';
import { API_DESCRIPTIONS, API_EXAMPLES } from '../../../../common/constants/api-descriptions';

export class ProcessReturnDto {
    @ApiProperty({
        enum: ReturnStatus,
        description: API_DESCRIPTIONS.RETURN.STATUS,
    })
    @IsEnum(ReturnStatus)
    status: ReturnStatus;

    @ApiProperty({
        description: API_DESCRIPTIONS.RETURN.TRACKING_NUMBER,
        example: API_EXAMPLES.RETURN.TRACKING_NUMBER,
        required: false,
    })
    @IsOptional()
    @IsString()
    trackingNumber?: string;

    @ApiProperty({
        description: API_DESCRIPTIONS.RETURN.ADMIN_NOTES,
        example: API_EXAMPLES.RETURN.ADMIN_NOTES,
        required: false,
    })
    @IsOptional()
    @IsString()
    @Length(1, 1000)
    adminNotes?: string;
}
