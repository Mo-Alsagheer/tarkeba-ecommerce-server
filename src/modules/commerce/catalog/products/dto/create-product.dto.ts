import {
    IsString,
    IsNumber,
    IsArray,
    IsOptional,
    IsBoolean,
    Min,
    ValidateNested,
    IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    CREATE_PRODUCT_SWAGGER,
    VARIANT_SWAGGER,
    DIMENSIONS_SWAGGER,
    SEO_SWAGGER,
} from '../../../../../common/constants/products-swagger.constants';

class DimensionsDto {
    @ApiProperty(DIMENSIONS_SWAGGER.length)
    @IsNumber()
    @Min(0)
    length: number;

    @ApiProperty(DIMENSIONS_SWAGGER.width)
    @IsNumber()
    @Min(0)
    width: number;

    @ApiProperty(DIMENSIONS_SWAGGER.height)
    @IsNumber()
    @Min(0)
    height: number;
}

class SeoDto {
    @ApiPropertyOptional(SEO_SWAGGER.title)
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional(SEO_SWAGGER.description)
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional(SEO_SWAGGER.keywords)
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    keywords?: string[];
}

class VariantDto {
    @ApiProperty(VARIANT_SWAGGER.size)
    @IsString()
    size: string;

    @ApiProperty(VARIANT_SWAGGER.price)
    @IsNumber()
    @Min(0)
    price: number;

    @ApiPropertyOptional(VARIANT_SWAGGER.comparePrice)
    @IsOptional()
    @IsNumber()
    @Min(0)
    comparePrice?: number;

    @ApiProperty(VARIANT_SWAGGER.stock)
    @IsNumber()
    @Min(0)
    stock: number;
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

    @ApiProperty({ ...CREATE_PRODUCT_SWAGGER.variants, type: [VariantDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VariantDto)
    variants: VariantDto[];

    @ApiProperty(CREATE_PRODUCT_SWAGGER.categories)
    @IsArray()
    @IsMongoId({ each: true })
    categories: string[];

    @ApiPropertyOptional(CREATE_PRODUCT_SWAGGER.images)
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @ApiPropertyOptional(CREATE_PRODUCT_SWAGGER.isActive)
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional(CREATE_PRODUCT_SWAGGER.isFeatured)
    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean;

    @ApiPropertyOptional(CREATE_PRODUCT_SWAGGER.weight)
    @IsOptional()
    @IsNumber()
    @Min(0)
    weight?: number;

    @ApiPropertyOptional({ ...CREATE_PRODUCT_SWAGGER.dimensions, type: DimensionsDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => DimensionsDto)
    dimensions?: DimensionsDto;

    @ApiPropertyOptional(CREATE_PRODUCT_SWAGGER.attributes)
    @IsOptional()
    attributes?: Record<string, unknown>;

    @ApiPropertyOptional({ ...CREATE_PRODUCT_SWAGGER.seo, type: SeoDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => SeoDto)
    seo?: SeoDto;

    @ApiPropertyOptional(CREATE_PRODUCT_SWAGGER.tags)
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}
