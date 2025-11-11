import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
    API_DESCRIPTIONS,
    API_EXAMPLES,
    AUTH_VALIDATION_MESSAGES,
    AUTH_FIELD_CONSTRAINTS,
} from '../../../../common/constants';

export class ForgotPasswordDto {
    @ApiProperty({
        description: API_DESCRIPTIONS.AUTH.EMAIL,
        example: API_EXAMPLES.AUTH.EMAIL,
        format: AUTH_FIELD_CONSTRAINTS.EMAIL.FORMAT,
    })
    @IsEmail({}, { message: AUTH_VALIDATION_MESSAGES.EMAIL_INVALID })
    email: string;
}
