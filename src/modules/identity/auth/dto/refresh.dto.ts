import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    API_DESCRIPTIONS,
    API_EXAMPLES,
    AUTH_VALIDATION_MESSAGES,
} from '../../../../common/constants';

export class RefreshDto {
    @ApiPropertyOptional({
        description: API_DESCRIPTIONS.AUTH.REFRESH_TOKEN,
        example: API_EXAMPLES.AUTH.REFRESH_TOKEN,
    })
    @IsOptional()
    @IsNotEmpty({ message: AUTH_VALIDATION_MESSAGES.REFRESH_TOKEN_REQUIRED })
    refreshToken?: string;
}
