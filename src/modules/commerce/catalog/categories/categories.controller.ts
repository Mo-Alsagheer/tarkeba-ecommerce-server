import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import {
    CategoryResponseDto,
    CategoriesListResponseDto,
    CategoryTreeResponseDto,
    CategoryDeleteResponseDto,
} from './dto/category-response.dto';
import { JwtAuthGuard } from '../../../identity/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../identity/auth/guards/roles.guard';
import { Roles } from '../../../identity/auth/decorators/roles.decorator';
import { UserRole } from '../../../../common/enums';
import {
    CATEGORIES_MESSAGES,
    CATEGORIES_API_RESPONSES,
    CATEGORIES_OPERATIONS,
    CATEGORIES_CONTROLLER_LOG_MESSAGES,
    CATEGORIES_SWAGGER_PARAMS,
} from '../../../../common/constants';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
    private readonly logger = new Logger(CategoriesController.name);
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: CATEGORIES_OPERATIONS.CREATE_CATEGORY })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: CATEGORIES_API_RESPONSES.CATEGORY_CREATED,
        type: CategoryResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: CATEGORIES_API_RESPONSES.INVALID_INPUT_DATA,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: CATEGORIES_API_RESPONSES.UNAUTHORIZED,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: CATEGORIES_API_RESPONSES.FORBIDDEN_ADMIN_REQUIRED,
    })
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        this.logger.log(
            `${CATEGORIES_CONTROLLER_LOG_MESSAGES.CREATING_CATEGORY}: ${createCategoryDto.name}`
        );
        return await this.categoriesService.create(createCategoryDto);
    }

    @Get()
    @ApiOperation({ summary: CATEGORIES_OPERATIONS.GET_ALL_CATEGORIES })
    @ApiResponse({
        status: HttpStatus.OK,
        description: CATEGORIES_API_RESPONSES.CATEGORIES_RETRIEVED,
        type: CategoriesListResponseDto,
    })
    async findAll(@Query() queryDto: QueryCategoryDto) {
        this.logger.log(
            `${CATEGORIES_CONTROLLER_LOG_MESSAGES.FETCHING_CATEGORIES}: ${JSON.stringify(queryDto)}`
        );
        return await this.categoriesService.findAll(queryDto);
    }

    @Get('tree')
    @ApiOperation({ summary: CATEGORIES_OPERATIONS.GET_CATEGORY_TREE })
    @ApiResponse({
        status: HttpStatus.OK,
        description: CATEGORIES_API_RESPONSES.CATEGORY_TREE_RETRIEVED,
        type: [CategoryTreeResponseDto],
    })
    async getCategoryTree() {
        this.logger.log(CATEGORIES_CONTROLLER_LOG_MESSAGES.FETCHING_CATEGORY_TREE);
        return await this.categoriesService.getCategoryTree();
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: CATEGORIES_OPERATIONS.GET_CATEGORY_BY_SLUG })
    @ApiParam(CATEGORIES_SWAGGER_PARAMS.CATEGORY_SLUG)
    @ApiResponse({
        status: HttpStatus.OK,
        description: CATEGORIES_API_RESPONSES.CATEGORY_RETRIEVED,
        type: CategoryResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: CATEGORIES_API_RESPONSES.CATEGORY_NOT_FOUND,
    })
    async findBySlug(@Param('slug') slug: string) {
        this.logger.log(`${CATEGORIES_CONTROLLER_LOG_MESSAGES.FETCHING_CATEGORY_BY_SLUG}: ${slug}`);
        return await this.categoriesService.findBySlug(slug);
    }

    @Get(':id')
    @ApiOperation({ summary: CATEGORIES_OPERATIONS.GET_CATEGORY_BY_ID })
    @ApiParam(CATEGORIES_SWAGGER_PARAMS.CATEGORY_ID)
    @ApiResponse({
        status: HttpStatus.OK,
        description: CATEGORIES_API_RESPONSES.CATEGORY_RETRIEVED,
        type: CategoryResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: CATEGORIES_API_RESPONSES.CATEGORY_NOT_FOUND,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: CATEGORIES_API_RESPONSES.INVALID_CATEGORY_ID,
    })
    async findOne(@Param('id') id: string) {
        this.logger.log(`${CATEGORIES_CONTROLLER_LOG_MESSAGES.FETCHING_CATEGORY}: ${id}`);
        return await this.categoriesService.findOne(id);
    }

    @Get(':id/subcategories')
    @ApiOperation({ summary: CATEGORIES_OPERATIONS.GET_SUBCATEGORIES })
    @ApiParam(CATEGORIES_SWAGGER_PARAMS.CATEGORY_ID)
    @ApiResponse({
        status: HttpStatus.OK,
        description: CATEGORIES_API_RESPONSES.SUBCATEGORIES_RETRIEVED,
        type: [CategoryResponseDto],
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: CATEGORIES_API_RESPONSES.INVALID_CATEGORY_ID,
    })
    async getSubcategories(@Param('id') id: string) {
        this.logger.log(`${CATEGORIES_CONTROLLER_LOG_MESSAGES.FETCHING_SUBCATEGORIES}: ${id}`);
        return await this.categoriesService.getSubcategories(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: CATEGORIES_OPERATIONS.UPDATE_CATEGORY })
    @ApiParam(CATEGORIES_SWAGGER_PARAMS.CATEGORY_ID)
    @ApiResponse({
        status: HttpStatus.OK,
        description: CATEGORIES_API_RESPONSES.CATEGORY_UPDATED,
        type: CategoryResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: CATEGORIES_API_RESPONSES.CATEGORY_NOT_FOUND,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: CATEGORIES_API_RESPONSES.INVALID_INPUT_DATA,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: CATEGORIES_API_RESPONSES.UNAUTHORIZED,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: CATEGORIES_API_RESPONSES.FORBIDDEN_ADMIN_REQUIRED,
    })
    async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        this.logger.log(`${CATEGORIES_CONTROLLER_LOG_MESSAGES.UPDATING_CATEGORY}: ${id}`);
        return await this.categoriesService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: CATEGORIES_OPERATIONS.DELETE_CATEGORY })
    @ApiParam(CATEGORIES_SWAGGER_PARAMS.CATEGORY_ID)
    @ApiResponse({
        status: HttpStatus.OK,
        description: CATEGORIES_API_RESPONSES.CATEGORY_DELETED,
        type: CategoryDeleteResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: CATEGORIES_API_RESPONSES.CATEGORY_NOT_FOUND,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: CATEGORIES_API_RESPONSES.CANNOT_DELETE_WITH_PRODUCTS,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: CATEGORIES_API_RESPONSES.UNAUTHORIZED,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: CATEGORIES_API_RESPONSES.FORBIDDEN_ADMIN_REQUIRED,
    })
    async remove(@Param('id') id: string) {
        this.logger.log(`${CATEGORIES_CONTROLLER_LOG_MESSAGES.DELETING_CATEGORY}: ${id}`);
        await this.categoriesService.remove(id);
        return { message: CATEGORIES_MESSAGES.DELETED_SUCCESSFULLY };
    }

    @Patch(':id/product-count')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: CATEGORIES_OPERATIONS.UPDATE_PRODUCT_COUNT })
    @ApiParam(CATEGORIES_SWAGGER_PARAMS.CATEGORY_ID)
    @ApiResponse({
        status: HttpStatus.OK,
        description: CATEGORIES_API_RESPONSES.CATEGORY_UPDATED,
        type: CategoryResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: CATEGORIES_API_RESPONSES.CATEGORY_NOT_FOUND,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: CATEGORIES_API_RESPONSES.INVALID_CATEGORY_ID,
    })
    async updateProductCount(@Param('id') id: string, @Body() body: { count: number }) {
        this.logger.log(
            `${CATEGORIES_CONTROLLER_LOG_MESSAGES.UPDATING_PRODUCT_COUNT}: ${id}, count: ${body.count}`
        );
        return await this.categoriesService.updateProductCount(id, body.count);
    }
}
