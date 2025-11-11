import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    API_DESCRIPTIONS,
    API_EXAMPLES,
    AUTH_FIELD_CONSTRAINTS,
} from '../../../../common/constants';

export class UpdateProfileDto {
    @ApiPropertyOptional({
        description: API_DESCRIPTIONS.AUTH.USERNAME,
        example: API_EXAMPLES.AUTH.USERNAME,
        minLength: AUTH_FIELD_CONSTRAINTS.USERNAME.MIN_LENGTH,
        maxLength: AUTH_FIELD_CONSTRAINTS.USERNAME.MAX_LENGTH,
    })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiPropertyOptional({
        description: API_DESCRIPTIONS.AUTH.CONFIRM_PASSWORD,
        example: API_EXAMPLES.AUTH.PASSWORD,
        minLength: AUTH_FIELD_CONSTRAINTS.PASSWORD.MIN_LENGTH,
    })
    @IsOptional()
    @IsString()
    @MinLength(AUTH_FIELD_CONSTRAINTS.PASSWORD.MIN_LENGTH)
    currentPassword?: string;

    @ApiPropertyOptional({
        description: API_DESCRIPTIONS.AUTH.NEW_PASSWORD,
        example: API_EXAMPLES.AUTH.NEW_PASSWORD,
        minLength: AUTH_FIELD_CONSTRAINTS.PASSWORD.MIN_LENGTH,
        maxLength: AUTH_FIELD_CONSTRAINTS.PASSWORD.MAX_LENGTH,
    })
    @IsOptional()
    @IsString()
    @MinLength(AUTH_FIELD_CONSTRAINTS.PASSWORD.MIN_LENGTH)
    newPassword?: string;
}
