import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { ReviewsModule } from './reviews/reviews.module';

/**
 * CatalogModule - Product catalog management
 *
 * This module groups catalog-related functionality:
 * - Products (CRUD, search, featured)
 * - Categories (hierarchical structure)
 * - Reviews (ratings, comments)
 */
@Module({
    imports: [ProductsModule, CategoriesModule, ReviewsModule],
    exports: [ProductsModule, CategoriesModule, ReviewsModule],
})
export class CatalogModule {}
