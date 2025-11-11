import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
    API_DESCRIPTIONS,
    API_EXAMPLES,
    AUTH_VALIDATION_MESSAGES,
} from '../../../../common/constants';

export class RefreshDto {
    @ApiProperty({
        description: API_DESCRIPTIONS.AUTH.REFRESH_TOKEN,
        example: API_EXAMPLES.AUTH.REFRESH_TOKEN,
    })
    @IsNotEmpty({ message: AUTH_VALIDATION_MESSAGES.REFRESH_TOKEN_REQUIRED })
    refreshToken: string;
}
