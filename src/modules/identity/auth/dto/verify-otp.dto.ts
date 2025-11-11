import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MESSAGES } from '../../../../common/constants';
import { API_DESCRIPTIONS, API_EXAMPLES } from '../../../../common/constants/api-descriptions';

export class VerifyOtpDto {
    @ApiProperty({
        description: API_DESCRIPTIONS.AUTH.EMAIL,
        example: API_EXAMPLES.AUTH.EMAIL,
    })
    @IsEmail({}, { message: MESSAGES.AUTH.OTP_INVALID_FORMAT })
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
}
