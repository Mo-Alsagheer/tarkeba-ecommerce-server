import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';
import { Page, PageSchema } from './entities/page.entity';
import { AuthModule } from '../../../identity/auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }]),
        AuthModule,
    ],
    controllers: [PagesController],
    providers: [PagesService],
    exports: [PagesService],
})
export class PagesModule {}
