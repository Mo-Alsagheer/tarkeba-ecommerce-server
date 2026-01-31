import {
    IsString,
    IsNotEmpty,
    MinLength,
    MaxLength,
    IsBoolean,
    IsOptional,
    Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePageDto {
    @ApiProperty({
        description: 'Unique slug for the page URL',
        example: 'about-us',
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'Slug must be lowercase with hyphens only',
    })
    slug: string;

    @ApiProperty({
        description: 'Page title',
        example: 'About Us',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(200)
    title: string;

    @ApiProperty({
        description: 'HTML content of the page',
        example: '<h1>About Us</h1><p>We are...</p>',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    content: string;

    @ApiProperty({
        description: 'Meta description for SEO',
        example: 'Learn more about our company',
        required: false,
    })
    @IsString()
    @IsOptional()
    @MaxLength(160)
    metaDescription?: string;

    @ApiProperty({
        description: 'Whether the page is published',
        example: true,
        required: false,
        default: true,
    })
    @IsBoolean()
    @IsOptional()
    isPublished?: boolean;
}
