import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category, CategorySchema } from './entities/category.entity';
import { AuthModule } from '../../../identity/auth/auth.module';
import { FileUploadModule } from '../../../common/file-upload/file-upload.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
        AuthModule,
        FileUploadModule,
    ],
    controllers: [CategoriesController],
    providers: [CategoriesService],
    exports: [CategoriesService], // Export for use in other modules
})
export class CategoriesModule {}
