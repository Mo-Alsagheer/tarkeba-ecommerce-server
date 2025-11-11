import { ProductStatus, ProductType, StockStatus, WeightUnit, DimensionUnit } from '../enums';
import { ObjectId } from './common.types';

export type ProductImage = {
    id: string;
    url: string;
    alt: string;
    isPrimary: boolean;
    order: number;
};

export type ProductVariant = {
    id: string;
    name: string;
    sku: string;
    price: number;
    compareAtPrice?: number;
    inventory: {
        quantity: number;
        trackQuantity: boolean;
        allowBackorder: boolean;
    };
    attributes: Record<string, string>;
    images: ProductImage[];
};

export type ProductDimensions = {
    length: number;
    width: number;
    height: number;
    unit: DimensionUnit;
};

export type ProductWeight = {
    value: number;
    unit: WeightUnit;
};

export type ProductSEO = {
    title?: string;
    description?: string;
    keywords?: string[];
    slug: string;
};

export type ProductInventory = {
    sku: string;
    quantity: number;
    trackQuantity: boolean;
    allowBackorder: boolean;
    lowStockThreshold: number;
    status: StockStatus;
};

export type ProductPricing = {
    basePrice: number;
    salePrice?: number;
    costPrice?: number;
    compareAtPrice?: number;
    taxable: boolean;
    taxCategory?: string;
};

export type ProductShipping = {
    weight: ProductWeight;
    dimensions: ProductDimensions;
    requiresShipping: boolean;
    shippingClass?: string;
};

export type ProductStats = {
    views: number;
    purchases: number;
    rating: number;
    reviewCount: number;
    wishlistCount: number;
};

export type ProductSummary = {
    id: ObjectId;
    name: string;
    slug: string;
    price: number;
    salePrice?: number;
    image?: string;
    status: ProductStatus;
    rating: number;
    reviewCount: number;
};
