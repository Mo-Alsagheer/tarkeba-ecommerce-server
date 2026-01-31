import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Page, PageDocument } from './entities/page.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
    private readonly logger = new Logger(PagesService.name);

    constructor(
        @InjectModel(Page.name)
        private pageModel: Model<PageDocument>
    ) {}

    async create(createPageDto: CreatePageDto): Promise<Page> {
        try {
            const page = new this.pageModel(createPageDto);
            const savedPage = await page.save();
            this.logger.log(`Page created with slug: ${savedPage.slug}`);
            return savedPage;
        } catch (error: any) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (error.code === 11000) {
                this.logger.warn(`Duplicate slug attempted: ${createPageDto.slug}`);
                throw new BadRequestException('Page with this slug already exists');
            }
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(
                `Error creating page: ${errorMsg}`,
                error instanceof Error ? error.stack : undefined
            );
            throw error;
        }
    }

    async findAll(): Promise<{ pages: Page[]; total: number }> {
        const pages = await this.pageModel.find().sort({ createdAt: -1 }).exec();

        this.logger.log(`Retrieved ${pages.length} pages`);

        return {
            pages,
            total: pages.length,
        };
    }

    async findBySlug(slug: string, isAdmin = false): Promise<Page> {
        const query: Record<string, any> = { slug };

        // Non-admin users can only see published pages
        if (!isAdmin) {
            query.isPublished = true;
        }

        const page = await this.pageModel.findOne(query).exec();

        if (!page) {
            this.logger.warn(`Page not found with slug: ${slug}`);
            throw new NotFoundException('Page not found');
        }

        this.logger.log(`Retrieved page with slug: ${slug}`);
        return page;
    }

    async update(id: string, updatePageDto: UpdatePageDto): Promise<Page> {
        const page = await this.pageModel
            .findByIdAndUpdate(id, updatePageDto, { new: true })
            .exec();

        if (!page) {
            this.logger.warn(`Page not found with id: ${id}`);
            throw new NotFoundException('Page not found');
        }

        this.logger.log(`Page updated with id: ${id}`);
        return page;
    }

    async remove(id: string): Promise<void> {
        const result = await this.pageModel.findByIdAndDelete(id).exec();

        if (!result) {
            this.logger.warn(`Page not found with id: ${id}`);
            throw new NotFoundException('Page not found');
        }

        this.logger.log(`Page deleted with id: ${id}`);
    }
}
