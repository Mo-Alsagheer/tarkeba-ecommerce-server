import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, SortOrder as MongooseSortOrder } from 'mongoose';
import { Category, CategoryDocument } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { ICategoryTree, ICategoriesResponse } from '../../../../common/interfaces';
import { CATEGORIES_ERROR_MESSAGES, CATEGORIES_LOG_MESSAGES } from '../../../../common/constants';

@Injectable()
export class CategoriesService {
    private readonly logger = new Logger(CategoriesService.name);
    constructor(
        @InjectModel(Category.name)
        private categoryModel: Model<CategoryDocument>
    ) {}

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        try {
            // Check if slug already exists
            const existingSlug = await this.categoryModel.findOne({
                slug: createCategoryDto.slug,
            });
            if (existingSlug) {
                throw new BadRequestException(CATEGORIES_ERROR_MESSAGES.SLUG_ALREADY_EXISTS);
            }

            // Validate parent category if provided
            if (createCategoryDto.parentID) {
                const parentCategory = await this.categoryModel.findById(
                    createCategoryDto.parentID
                );
                if (!parentCategory) {
                    throw new BadRequestException(
                        CATEGORIES_ERROR_MESSAGES.PARENT_CATEGORY_NOT_FOUND
                    );
                }
            }

            // Create category
            const category = await this.categoryModel.create(createCategoryDto);
            this.logger.log(`${CATEGORIES_LOG_MESSAGES.CATEGORY_CREATED}: ${String(category._id)}`);
            return category;
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : CATEGORIES_ERROR_MESSAGES.UNKNOWN_ERROR;
            this.logger.error(`${CATEGORIES_LOG_MESSAGES.FAILED_TO_CREATE}: ${errorMessage}`);
            throw error;
        }
    }

    async findAll(queryDto: QueryCategoryDto): Promise<ICategoriesResponse> {
        const {
            page = 1,
            limit = 10,
            search,
            parentID,
            isActive,
            sortBy = 'sortOrder',
            sortOrder = 'asc',
        } = queryDto;

        const skip = (page - 1) * limit;
        const query: FilterQuery<CategoryDocument> = {};

        // Build query filters
        if (search) {
            query.$text = { $search: search };
        }

        if (parentID !== undefined) {
            if (parentID === 'null' || parentID === '') {
                query.parentID = null; // Root categories
            } else {
                query.parentID = new Types.ObjectId(parentID);
            }
        }

        if (isActive !== undefined) {
            query.isActive = isActive;
        }

        // Build sort object
        const sort: Record<string, MongooseSortOrder> = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        try {
            const [categories, total] = await Promise.all([
                this.categoryModel
                    .find(query)
                    .populate('parentID', 'name slug')
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                this.categoryModel.countDocuments(query),
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                categories,
                total,
                page,
                limit,
                totalPages,
            };
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : CATEGORIES_ERROR_MESSAGES.UNKNOWN_ERROR;
            this.logger.error(
                `${CATEGORIES_LOG_MESSAGES.FAILED_TO_FETCH_CATEGORIES}: ${errorMessage}`
            );
            throw error;
        }
    }

    async findOne(id: string): Promise<Category> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(CATEGORIES_ERROR_MESSAGES.INVALID_CATEGORY_ID);
        }

        try {
            const category = await this.categoryModel
                .findById(id)
                .populate('parentID', 'name slug')
                .exec();

            if (!category) {
                throw new NotFoundException(CATEGORIES_ERROR_MESSAGES.CATEGORY_NOT_FOUND);
            }

            return category;
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : CATEGORIES_ERROR_MESSAGES.UNKNOWN_ERROR;
            this.logger.error(`${CATEGORIES_LOG_MESSAGES.FAILED_TO_FETCH} ${id}: ${errorMessage}`);
            throw error;
        }
    }

    async findBySlug(slug: string): Promise<Category> {
        try {
            const category = await this.categoryModel
                .findOne({ slug })
                .populate('parentID', 'name slug')
                .exec();

            if (!category) {
                throw new NotFoundException(CATEGORIES_ERROR_MESSAGES.CATEGORY_NOT_FOUND);
            }

            return category;
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : CATEGORIES_ERROR_MESSAGES.UNKNOWN_ERROR;
            this.logger.error(
                `${CATEGORIES_LOG_MESSAGES.FAILED_TO_FETCH_BY_SLUG} ${slug}: ${errorMessage}`
            );
            throw error;
        }
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(CATEGORIES_ERROR_MESSAGES.INVALID_CATEGORY_ID);
        }

        try {
            // Check if slug already exists (if updating slug)
            if (updateCategoryDto.slug) {
                const existingSlug = await this.categoryModel.findOne({
                    slug: updateCategoryDto.slug,
                    _id: { $ne: id },
                });
                if (existingSlug) {
                    throw new BadRequestException(CATEGORIES_ERROR_MESSAGES.SLUG_ALREADY_EXISTS);
                }
            }

            // Validate parent category and prevent circular references
            if (updateCategoryDto.parentID) {
                if (updateCategoryDto.parentID === id) {
                    throw new BadRequestException(
                        CATEGORIES_ERROR_MESSAGES.CANNOT_SET_SELF_AS_PARENT
                    );
                }

                const parentCategory = await this.categoryModel.findById(
                    updateCategoryDto.parentID
                );
                if (!parentCategory) {
                    throw new BadRequestException(
                        CATEGORIES_ERROR_MESSAGES.PARENT_CATEGORY_NOT_FOUND
                    );
                }

                // Check for circular references
                const isCircular = await this.checkCircularReference(
                    id,
                    updateCategoryDto.parentID
                );
                if (isCircular) {
                    throw new BadRequestException(
                        CATEGORIES_ERROR_MESSAGES.CIRCULAR_REFERENCE_DETECTED
                    );
                }
            }

            const category = await this.categoryModel
                .findByIdAndUpdate(id, updateCategoryDto, { new: true })
                .populate('parentID', 'name slug')
                .exec();

            if (!category) {
                throw new NotFoundException(CATEGORIES_ERROR_MESSAGES.CATEGORY_NOT_FOUND);
            }

            this.logger.log(`${CATEGORIES_LOG_MESSAGES.CATEGORY_UPDATED}: ${String(category._id)}`);
            return category;
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : CATEGORIES_ERROR_MESSAGES.UNKNOWN_ERROR;
            this.logger.error(`${CATEGORIES_LOG_MESSAGES.FAILED_TO_UPDATE} ${id}: ${errorMessage}`);
            throw error;
        }
    }

    async remove(id: string): Promise<void> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(CATEGORIES_ERROR_MESSAGES.INVALID_CATEGORY_ID);
        }

        try {
            const category = await this.categoryModel.findById(id);
            if (!category) {
                throw new NotFoundException(CATEGORIES_ERROR_MESSAGES.CATEGORY_NOT_FOUND);
            }

            // Check if category has products
            if (category.productCount > 0) {
                throw new BadRequestException(
                    CATEGORIES_ERROR_MESSAGES.CANNOT_DELETE_WITH_PRODUCTS
                );
            }

            // Check if category has subcategories
            const subcategories = await this.categoryModel.countDocuments({
                parentID: id,
            });
            if (subcategories > 0) {
                throw new BadRequestException(
                    CATEGORIES_ERROR_MESSAGES.CANNOT_DELETE_WITH_SUBCATEGORIES
                );
            }

            await this.categoryModel.findByIdAndDelete(id).exec();
            this.logger.log(`${CATEGORIES_LOG_MESSAGES.CATEGORY_DELETED}: ${id}`);
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : CATEGORIES_ERROR_MESSAGES.UNKNOWN_ERROR;
            this.logger.error(`${CATEGORIES_LOG_MESSAGES.FAILED_TO_DELETE} ${id}: ${errorMessage}`);
            throw error;
        }
    }

    async getCategoryTree(): Promise<ICategoryTree[]> {
        try {
            const categories = await this.categoryModel
                .find({ isActive: true })
                .sort({ sortOrder: 1, name: 1 })
                .exec();

            return this.buildCategoryTree(categories);
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : CATEGORIES_ERROR_MESSAGES.UNKNOWN_ERROR;
            this.logger.error(`${CATEGORIES_LOG_MESSAGES.FAILED_TO_FETCH_TREE}: ${errorMessage}`);
            throw error;
        }
    }

    async getSubcategories(parentID: string): Promise<Category[]> {
        if (!Types.ObjectId.isValid(parentID)) {
            throw new BadRequestException(CATEGORIES_ERROR_MESSAGES.INVALID_PARENT_CATEGORY_ID);
        }

        try {
            return await this.categoryModel
                .find({
                    parentID: new Types.ObjectId(parentID),
                    isActive: true,
                })
                .sort({ sortOrder: 1, name: 1 })
                .exec();
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : CATEGORIES_ERROR_MESSAGES.UNKNOWN_ERROR;
            this.logger.error(
                `${CATEGORIES_LOG_MESSAGES.FAILED_TO_FETCH_SUBCATEGORIES} ${parentID}: ${errorMessage}`
            );
            throw error;
        }
    }

    async updateProductCount(id: string, count: number): Promise<Category> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(CATEGORIES_ERROR_MESSAGES.INVALID_CATEGORY_ID);
        }

        try {
            const category = await this.categoryModel
                .findByIdAndUpdate(id, { productCount: count }, { new: true })
                .exec();

            if (!category) {
                throw new NotFoundException(CATEGORIES_ERROR_MESSAGES.CATEGORY_NOT_FOUND);
            }

            this.logger.log(`${CATEGORIES_LOG_MESSAGES.PRODUCT_COUNT_UPDATED} ${id}: ${count}`);
            return category;
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : CATEGORIES_ERROR_MESSAGES.UNKNOWN_ERROR;
            this.logger.error(
                `${CATEGORIES_LOG_MESSAGES.FAILED_TO_UPDATE_PRODUCT_COUNT} ${id}: ${errorMessage}`
            );
            throw error;
        }
    }

    private buildCategoryTree(categories: CategoryDocument[]): ICategoryTree[] {
        const categoryMap = new Map<string, ICategoryTree>();
        const rootCategories: ICategoryTree[] = [];

        // Create a map of categories by ID
        categories.forEach((category) => {
            const categoryObj: ICategoryTree = {
                ...category.toObject(),
                children: [],
            } as ICategoryTree;
            categoryMap.set(String(category._id), categoryObj);
        });

        // Build the tree structure
        categories.forEach((category) => {
            const categoryObj = categoryMap.get(String(category._id));
            if (!categoryObj) return;

            if (category.parentID) {
                const parent = categoryMap.get(String(category.parentID));
                if (parent) {
                    parent.children.push(categoryObj);
                }
            } else {
                rootCategories.push(categoryObj);
            }
        });

        return rootCategories;
    }

    private async checkCircularReference(categoryId: string, parentID: string): Promise<boolean> {
        let currentParentID = parentID;

        while (currentParentID) {
            if (currentParentID === categoryId) {
                return true; // Circular reference found
            }

            const parent = await this.categoryModel.findById(currentParentID).exec();
            if (!parent) {
                break;
            }

            currentParentID = parent.parentID?.toString() || '';
        }

        return false;
    }
}
