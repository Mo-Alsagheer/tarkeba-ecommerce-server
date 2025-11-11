import { IsEmail, IsNotEmpty, IsString, Length, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from './register.dto';
import {
    API_EXAMPLES,
    API_DESCRIPTIONS,
    AUTH_FIELD_CONSTRAINTS,
    AUTH_VALIDATION_MESSAGES,
    MESSAGES,
} from '../../../../common/constants';

export class ResetPasswordDto {
    @ApiProperty({
        description: API_DESCRIPTIONS.AUTH.EMAIL,
        example: API_EXAMPLES.AUTH.EMAIL,
    })
    @IsEmail({}, { message: AUTH_VALIDATION_MESSAGES.EMAIL_INVALID })
    email: string;

    @ApiProperty({
        description: API_DESCRIPTIONS.AUTH.OTP_CODE,
        example: API_EXAMPLES.AUTH.OTP_CODE,
        minLength: 6,
        maxLength: 6,
    })
    @IsNotEmpty({ message: MESSAGES.AUTH.OTP_REQUIRED })
    @IsString()
    @Length(6, 6, { message: MESSAGES.AUTH.OTP_MUST_BE_6_DIGITS })
    code: string;

    @ApiProperty({
        description: API_DESCRIPTIONS.AUTH.NEW_PASSWORD,
        example: API_EXAMPLES.AUTH.PASSWORD,
        minLength: AUTH_FIELD_CONSTRAINTS.PASSWORD.MIN_LENGTH,
    })
    @IsNotEmpty({ message: AUTH_VALIDATION_MESSAGES.PASSWORD_REQUIRED })
    @MinLength(AUTH_FIELD_CONSTRAINTS.PASSWORD.MIN_LENGTH, {
        message: AUTH_VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH,
    })
    @Matches(AUTH_FIELD_CONSTRAINTS.PASSWORD.PATTERN, {
        message: AUTH_VALIDATION_MESSAGES.PASSWORD_COMPLEXITY,
    })
    newPassword: string;

    @ApiProperty({
        description: API_DESCRIPTIONS.AUTH.CONFIRM_PASSWORD,
        example: API_EXAMPLES.AUTH.PASSWORD,
        minLength: AUTH_FIELD_CONSTRAINTS.PASSWORD.MIN_LENGTH,
    })
    @IsNotEmpty({ message: AUTH_VALIDATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED })
    @IsString()
    @Match('newPassword', {
        message: AUTH_VALIDATION_MESSAGES.PASSWORDS_DO_NOT_MATCH,
    })
    confirmPassword: string;
}
