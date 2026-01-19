import { IsString, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ADDRESS_DTO_DESCRIPTIONS, ADDRESS_DTO_EXAMPLES } from '../../../../../common/constants';

export class AddressDto {
    @ApiProperty({
        description: ADDRESS_DTO_DESCRIPTIONS.CUSTOMER_NAME,
        example: ADDRESS_DTO_EXAMPLES.CUSTOMER_NAME,
    })
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    customerName: string;

    @ApiProperty({
        description: ADDRESS_DTO_DESCRIPTIONS.ADDRESS_LINE_1,
        example: ADDRESS_DTO_EXAMPLES.ADDRESS_LINE_1,
    })
    @IsString()
    @MinLength(5)
    @MaxLength(100)
    addressLine1: string;

    @ApiProperty({
        description: ADDRESS_DTO_DESCRIPTIONS.CITY,
        example: ADDRESS_DTO_EXAMPLES.CITY,
    })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    city: string;

    @ApiProperty({
        description: ADDRESS_DTO_DESCRIPTIONS.STATE,
        example: ADDRESS_DTO_EXAMPLES.STATE,
    })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    state: string;

    @ApiPropertyOptional({
        description: ADDRESS_DTO_DESCRIPTIONS.PHONE,
        example: ADDRESS_DTO_EXAMPLES.PHONE,
    })
    @IsOptional()
    @IsString()
    @MinLength(10)
    @MaxLength(20)
    @Matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, {
        message: 'Phone number must be a valid format',
    })
    phone?: string;
}
