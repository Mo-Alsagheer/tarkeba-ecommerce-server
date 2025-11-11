import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CATEGORIES_SWAGGER_EXAMPLES } from '../../../../../common/constants';

export class CategorySeoResponseDto {
    @ApiPropertyOptional({
        description: 'SEO title',
        example: CATEGORIES_SWAGGER_EXAMPLES.SEO_TITLE,
    })
    title?: string;

    @ApiPropertyOptional({
        description: 'SEO meta description',
        example: CATEGORIES_SWAGGER_EXAMPLES.SEO_DESCRIPTION,
    })
    description?: string;

    @ApiPropertyOptional({
        description: 'SEO keywords',
        type: [String],
        example: CATEGORIES_SWAGGER_EXAMPLES.SEO_KEYWORDS,
    })
    keywords?: string[];
}

export class CategoryResponseDto {
    @ApiProperty({
        description: 'Category ID',
        example: CATEGORIES_SWAGGER_EXAMPLES.MONGODB_OBJECT_ID,
    })
    _id: string;

    @ApiProperty({
        description: 'Category name',
        example: CATEGORIES_SWAGGER_EXAMPLES.CATEGORY_NAME,
    })
    name: string;

    @ApiPropertyOptional({
        description: 'Category description',
        example: CATEGORIES_SWAGGER_EXAMPLES.CATEGORY_DESCRIPTION,
    })
    description?: string;

    @ApiProperty({
        description: 'URL-friendly slug',
        example: CATEGORIES_SWAGGER_EXAMPLES.CATEGORY_SLUG,
    })
    slug: string;

    @ApiPropertyOptional({
        description: 'Parent category ID',
        example: CATEGORIES_SWAGGER_EXAMPLES.MONGODB_OBJECT_ID,
    })
    parentID?: string;

    @ApiProperty({
        description: 'Active status',
        example: true,
    })
    isActive: boolean;

    @ApiProperty({
        description: 'Sort order',
        example: 10,
    })
    sortOrder: number;

    @ApiPropertyOptional({
        description: 'Category image URL',
        example: CATEGORIES_SWAGGER_EXAMPLES.CATEGORY_IMAGE_URL,
    })
    image?: string;

    @ApiPropertyOptional({
        description: 'SEO metadata',
        type: CategorySeoResponseDto,
    })
    seo?: CategorySeoResponseDto;

    @ApiProperty({
        description: 'Number of products in category',
        example: 150,
    })
    productCount: number;

    @ApiPropertyOptional({
        description: 'Category tags',
        type: [String],
        example: CATEGORIES_SWAGGER_EXAMPLES.TAGS,
    })
    tags?: string[];

    @ApiProperty({
        description: 'Creation timestamp',
        example: '2024-01-15T10:30:00.000Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Last update timestamp',
        example: '2024-01-15T10:30:00.000Z',
    })
    updatedAt: Date;
}

export class CategoryTreeResponseDto extends CategoryResponseDto {
    @ApiProperty({
        description: 'Child categories',
        type: [CategoryTreeResponseDto],
        example: [],
    })
    children: CategoryTreeResponseDto[];
}

export class CategoriesListResponseDto {
    @ApiProperty({
        description: 'List of categories',
        type: [CategoryResponseDto],
    })
    categories: CategoryResponseDto[];

    @ApiProperty({
        description: 'Total number of categories',
        example: 50,
    })
    total: number;

    @ApiProperty({
        description: 'Current page number',
        example: 1,
    })
    page: number;

    @ApiProperty({
        description: 'Items per page',
        example: 10,
    })
    limit: number;

    @ApiProperty({
        description: 'Total number of pages',
        example: 5,
    })
    totalPages: number;
}

export class CategoryDeleteResponseDto {
    @ApiProperty({
        description: 'Success message',
        example: 'Category deleted successfully',
    })
    message: string;
}
