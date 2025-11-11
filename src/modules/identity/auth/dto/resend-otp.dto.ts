import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendOtpDto {
    @ApiProperty({
        description: 'Email address to resend OTP',
        example: 'user@example.com',
    })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;
}
