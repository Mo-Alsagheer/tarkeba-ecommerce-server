import { IsString, IsOptional, IsBoolean, IsNumber, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CATEGORIES_SWAGGER_EXAMPLES } from '../../../../../common/constants';

class CategorySeoDto {
    @ApiPropertyOptional({
        description: 'SEO title for the category page',
        example: CATEGORIES_SWAGGER_EXAMPLES.SEO_TITLE,
        maxLength: 60,
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({
        description: 'SEO meta description for the category page',
        example: CATEGORIES_SWAGGER_EXAMPLES.SEO_DESCRIPTION,
        maxLength: 160,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: 'SEO keywords for the category',
        type: [String],
        example: CATEGORIES_SWAGGER_EXAMPLES.SEO_KEYWORDS,
    })
    @IsOptional()
    @IsString({ each: true })
    keywords?: string[];
}

export class CreateCategoryDto {
    @ApiProperty({
        description: 'Category name',
        example: CATEGORIES_SWAGGER_EXAMPLES.CATEGORY_NAME,
        minLength: 2,
        maxLength: 100,
    })
    @IsString()
    name: string;

    @ApiPropertyOptional({
        description: 'Detailed description of the category',
        example: CATEGORIES_SWAGGER_EXAMPLES.CATEGORY_DESCRIPTION,
        maxLength: 500,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: 'URL-friendly slug for the category (must be unique)',
        example: CATEGORIES_SWAGGER_EXAMPLES.CATEGORY_SLUG,
        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
    })
    @IsString()
    slug: string;

    @ApiPropertyOptional({
        description: 'Parent category ID for creating subcategories (MongoDB ObjectId)',
        example: CATEGORIES_SWAGGER_EXAMPLES.MONGODB_OBJECT_ID,
    })
    @IsOptional()
    @IsString()
    parentID?: string;

    @ApiPropertyOptional({
        description: 'Whether the category is active and visible to users',
        default: true,
        example: true,
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return Boolean(value);
    })
    @IsBoolean()
    isActive?: boolean = true;

    @ApiPropertyOptional({
        description: 'Sort order for displaying categories (lower numbers appear first)',
        default: 0,
        example: 10,
        minimum: 0,
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') return parseInt(value, 10);
        if (typeof value === 'number') return value;
        return 0;
    })
    @IsNumber()
    sortOrder?: number = 0;

    @ApiPropertyOptional({
        description: 'SEO metadata for the category page',
        type: CategorySeoDto,
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value) as CategorySeoDto;
            } catch {
                return undefined;
            }
        }
        return value as CategorySeoDto;
    })
    @ValidateNested()
    @Type(() => CategorySeoDto)
    seo?: CategorySeoDto;

    @ApiPropertyOptional({
        description: 'Tags for categorizing and filtering',
        type: [String],
        example: CATEGORIES_SWAGGER_EXAMPLES.TAGS,
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value) as string[];
            } catch {
                return [value];
            }
        }
        if (Array.isArray(value)) return value as string[];
        return [];
    })
    @IsString({ each: true })
    tags?: string[];
}
