import { IsString, IsArray, IsOptional, IsBoolean, IsMongoId } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    CREATE_PRODUCT_SWAGGER,
    SEO_SWAGGER,
} from '../../../../../common/constants/products-swagger.constants';

interface VariantInterface {
    size: string;
    price: number;
    comparePrice?: number;
    stock: number;
}

interface SeoInterface {
    title?: string;
    description?: string;
    keywords?: string[];
}

export class CreateProductDto {
    @ApiProperty(CREATE_PRODUCT_SWAGGER.name)
    @IsString()
    name: string;

    @ApiProperty(CREATE_PRODUCT_SWAGGER.description)
    @IsString()
    description: string;

    @ApiProperty(CREATE_PRODUCT_SWAGGER.slug)
    @IsString()
    slug: string;

    @ApiProperty({ ...CREATE_PRODUCT_SWAGGER.variants })
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        }
        return Array.isArray(value) ? value : [];
    })
    @IsArray()
    variants: VariantInterface[];

    @ApiProperty(CREATE_PRODUCT_SWAGGER.categories)
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
    @IsArray()
    @IsMongoId({ each: true })
    categories: string[];

    @ApiPropertyOptional(CREATE_PRODUCT_SWAGGER.isActive)
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return Boolean(value);
    })
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional(CREATE_PRODUCT_SWAGGER.isFeatured)
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return Boolean(value);
    })
    @IsBoolean()
    isFeatured?: boolean;

    @ApiPropertyOptional({ ...CREATE_PRODUCT_SWAGGER.seo })
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value) as SeoInterface;
            } catch {
                return undefined;
            }
        }
        return value as SeoInterface;
    })
    seo?: SeoInterface;

    @ApiPropertyOptional(CREATE_PRODUCT_SWAGGER.tags)
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
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}
