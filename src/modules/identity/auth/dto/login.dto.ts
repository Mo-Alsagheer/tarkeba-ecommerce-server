import { IsEmail, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    API_DESCRIPTIONS,
    API_EXAMPLES,
    AUTH_VALIDATION_MESSAGES,
    AUTH_FIELD_CONSTRAINTS,
} from '../../../../common/constants';

export class LoginDto {
    @ApiProperty({
        description: API_DESCRIPTIONS.AUTH.EMAIL,
        example: API_EXAMPLES.AUTH.EMAIL,
        format: AUTH_FIELD_CONSTRAINTS.EMAIL.FORMAT,
    })
    @IsEmail({}, { message: AUTH_VALIDATION_MESSAGES.EMAIL_INVALID })
    email: string;

    @ApiProperty({
        description: API_DESCRIPTIONS.AUTH.PASSWORD,
        example: API_EXAMPLES.AUTH.PASSWORD,
        minLength: AUTH_FIELD_CONSTRAINTS.PASSWORD.MIN_LENGTH,
    })
    @IsNotEmpty({ message: AUTH_VALIDATION_MESSAGES.PASSWORD_REQUIRED })
    password: string;

    @ApiPropertyOptional({
        description: API_DESCRIPTIONS.AUTH.REMEMBER_ME,
        example: API_EXAMPLES.AUTH.REMEMBER_ME,
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    rememberMe?: boolean = false;
}
