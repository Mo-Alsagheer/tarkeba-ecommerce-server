export enum ProductStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    DRAFT = 'draft',
    ARCHIVED = 'archived',
    OUT_OF_STOCK = 'out_of_stock',
}

export enum ProductType {
    PHYSICAL = 'physical',
    DIGITAL = 'digital',
    SERVICE = 'service',
    SUBSCRIPTION = 'subscription',
}

export enum StockStatus {
    IN_STOCK = 'in_stock',
    LOW_STOCK = 'low_stock',
    OUT_OF_STOCK = 'out_of_stock',
    DISCONTINUED = 'discontinued',
}

export enum ProductCondition {
    NEW = 'new',
    USED = 'used',
    REFURBISHED = 'refurbished',
}

export enum WeightUnit {
    GRAM = 'g',
    KILOGRAM = 'kg',
    POUND = 'lb',
    OUNCE = 'oz',
}

export enum DimensionUnit {
    CENTIMETER = 'cm',
    METER = 'm',
    INCH = 'in',
    FOOT = 'ft',
}
