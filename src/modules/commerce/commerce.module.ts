import { Module } from '@nestjs/common';
import { CatalogModule } from './catalog/catalog.module';
import { SalesModule } from './sales/sales.module';
import { ReturnsModule } from './returns/returns.module';

/**
 * CommerceModule - E-commerce domain aggregator
 *
 * This module groups all commerce-related functionality:
 * - Catalog (products, categories, reviews)
 * - Sales (cart, coupons, orders, payments)
 * - Returns (return requests, refunds)
 */
@Module({
    imports: [CatalogModule, SalesModule, ReturnsModule],
    exports: [CatalogModule, SalesModule, ReturnsModule],
})
export class CommerceModule {}
