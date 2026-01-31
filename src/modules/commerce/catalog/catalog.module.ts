import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { ReviewsModule } from './reviews/reviews.module';
import { PagesModule } from './pages/pages.module';

/**
 * CatalogModule - Product catalog management
 *
 * This module groups catalog-related functionality:
 * - Products (CRUD, search, featured)
 * - Categories (hierarchical structure)
 * - Reviews (ratings, comments)
 * - Pages (static content management)
 */
@Module({
    imports: [ProductsModule, CategoriesModule, ReviewsModule, PagesModule],
    exports: [ProductsModule, CategoriesModule, ReviewsModule, PagesModule],
})
export class CatalogModule {}
