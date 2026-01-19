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
    UseInterceptors,
    UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
    ApiConsumes,
    ApiBody,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { ValidateStockDto } from './dto/validate-stock.dto';
import { ReduceStockDto } from './dto/reduce-stock.dto';
import { JwtAuthGuard } from '../../../identity/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../identity/auth/guards/roles.guard';
import { Roles } from '../../../identity/auth/decorators/roles.decorator';
import { UserRole } from '../../../../common/enums';
import {
    PRODUCTS_MESSAGES,
    PRODUCTS_API_RESPONSES,
    PRODUCTS_OPERATIONS,
    PRODUCTS_LOG_MESSAGES,
} from '../../../../common/constants';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    private readonly logger = new Logger(ProductsController.name);
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @UseInterceptors(
        FilesInterceptor('images', 10, {
            limits: {
                fileSize: 10 * 1024 * 1024, // 10MB per file
            },
        })
    )
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: PRODUCTS_OPERATIONS.CREATE_PRODUCT })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'Nike Air Max' },
                description: { type: 'string', example: 'Comfortable running shoes' },
                slug: { type: 'string', example: 'nike-air-max' },
                variants: {
                    type: 'string',
                    example: JSON.stringify([{ size: 'M', price: 99.99, stock: 50 }]),
                    description: 'JSON string of variants array',
                },
                categories: {
                    type: 'string',
                    example: JSON.stringify(['507f1f77bcf86cd799439011']),
                    description: 'JSON string of category IDs',
                },
                images: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                    description: 'Product images (max 10)',
                },
                isActive: { type: 'string', example: 'true' },
                isFeatured: { type: 'string', example: 'false' },
                weight: { type: 'string', example: '0.5' },
                tags: {
                    type: 'string',
                    example: JSON.stringify(['shoes', 'sports']),
                    description: 'JSON string of tags',
                },
            },
            required: ['name', 'description', 'slug', 'variants', 'categories'],
        },
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: PRODUCTS_API_RESPONSES.PRODUCT_CREATED,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: PRODUCTS_API_RESPONSES.INVALID_INPUT_DATA,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: PRODUCTS_API_RESPONSES.UNAUTHORIZED,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: PRODUCTS_API_RESPONSES.FORBIDDEN_ADMIN_REQUIRED,
    })
    async create(
        @Body() createProductDto: CreateProductDto,
        @UploadedFiles() images?: Express.Multer.File[]
    ) {
        this.logger.log(PRODUCTS_LOG_MESSAGES.CREATING_PRODUCT(createProductDto.name));
        return await this.productsService.create(createProductDto, images);
    }

    @Get()
    @ApiOperation({ summary: PRODUCTS_OPERATIONS.GET_ALL_PRODUCTS })
    @ApiResponse({
        status: HttpStatus.OK,
        description: PRODUCTS_API_RESPONSES.PRODUCTS_RETRIEVED,
    })
    async findAll(@Query() queryDto: QueryProductDto) {
        this.logger.log(PRODUCTS_LOG_MESSAGES.FETCHING_PRODUCTS(JSON.stringify(queryDto)));
        return await this.productsService.findAll(queryDto);
    }

    @Get('featured')
    @ApiOperation({ summary: PRODUCTS_OPERATIONS.GET_FEATURED_PRODUCTS })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: PRODUCTS_API_RESPONSES.FEATURED_PRODUCTS_RETRIEVED,
    })
    async getFeatured(@Query('limit') limit?: number) {
        this.logger.log(PRODUCTS_LOG_MESSAGES.FETCHING_FEATURED(limit));
        return await this.productsService.getFeaturedProducts(limit);
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: PRODUCTS_OPERATIONS.GET_PRODUCT_BY_SLUG })
    @ApiResponse({
        status: HttpStatus.OK,
        description: PRODUCTS_API_RESPONSES.PRODUCT_RETRIEVED,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: PRODUCTS_API_RESPONSES.PRODUCT_NOT_FOUND,
    })
    async findBySlug(@Param('slug') slug: string) {
        this.logger.log(PRODUCTS_LOG_MESSAGES.FETCHING_BY_SLUG(slug));
        return await this.productsService.findBySlug(slug);
    }

    @Get(':id')
    @ApiOperation({ summary: PRODUCTS_OPERATIONS.GET_PRODUCT_BY_ID })
    @ApiResponse({
        status: HttpStatus.OK,
        description: PRODUCTS_API_RESPONSES.PRODUCT_RETRIEVED,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: PRODUCTS_API_RESPONSES.PRODUCT_NOT_FOUND,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: PRODUCTS_API_RESPONSES.INVALID_PRODUCT_ID,
    })
    async findOne(@Param('id') id: string) {
        this.logger.log(PRODUCTS_LOG_MESSAGES.FETCHING_BY_ID(id));
        return await this.productsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @UseInterceptors(
        FilesInterceptor('images', 10, {
            limits: {
                fileSize: 10 * 1024 * 1024, // 10MB per file
            },
        })
    )
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: PRODUCTS_OPERATIONS.UPDATE_PRODUCT })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'Nike Air Max' },
                description: { type: 'string', example: 'Comfortable running shoes' },
                variants: {
                    type: 'string',
                    example: JSON.stringify([{ size: 'M', price: 99.99, stock: 50 }]),
                },
                categories: {
                    type: 'string',
                    example: JSON.stringify(['507f1f77bcf86cd799439011']),
                },
                images: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                    description: 'Product images (max 10)',
                },
                isActive: { type: 'string', example: 'true' },
                isFeatured: { type: 'string', example: 'false' },
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: PRODUCTS_API_RESPONSES.PRODUCT_UPDATED,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: PRODUCTS_API_RESPONSES.PRODUCT_NOT_FOUND,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: PRODUCTS_API_RESPONSES.INVALID_INPUT_DATA,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: PRODUCTS_API_RESPONSES.UNAUTHORIZED,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: PRODUCTS_API_RESPONSES.FORBIDDEN_ADMIN_REQUIRED,
    })
    async update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @UploadedFiles() images?: Express.Multer.File[]
    ) {
        this.logger.log(PRODUCTS_LOG_MESSAGES.UPDATING_PRODUCT(id));
        return await this.productsService.update(id, updateProductDto, images);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: PRODUCTS_OPERATIONS.DELETE_PRODUCT })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: PRODUCTS_API_RESPONSES.PRODUCT_DELETED,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: PRODUCTS_API_RESPONSES.PRODUCT_NOT_FOUND,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: PRODUCTS_API_RESPONSES.INVALID_PRODUCT_ID,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: PRODUCTS_API_RESPONSES.UNAUTHORIZED,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: PRODUCTS_API_RESPONSES.FORBIDDEN_ADMIN_REQUIRED,
    })
    async remove(@Param('id') id: string) {
        this.logger.log(PRODUCTS_LOG_MESSAGES.DELETING_PRODUCT(id));
        await this.productsService.remove(id);
        return { message: PRODUCTS_MESSAGES.DELETED_SUCCESSFULLY };
    }

    @Patch(':id/stock')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: PRODUCTS_OPERATIONS.UPDATE_PRODUCT_STOCK })
    @ApiResponse({
        status: HttpStatus.OK,
        description: PRODUCTS_API_RESPONSES.STOCK_UPDATED,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: PRODUCTS_API_RESPONSES.PRODUCT_NOT_FOUND,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: PRODUCTS_API_RESPONSES.INSUFFICIENT_STOCK,
    })
    async updateStock(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
        this.logger.log(
            PRODUCTS_LOG_MESSAGES.UPDATING_STOCK(id, updateStockDto.size, updateStockDto.quantity)
        );
        return await this.productsService.updateStock(
            id,
            updateStockDto.quantity,
            updateStockDto.size
        );
    }

    @Get(':id/stock-status')
    @ApiOperation({ summary: PRODUCTS_OPERATIONS.GET_STOCK_STATUS })
    @ApiResponse({
        status: HttpStatus.OK,
        description: PRODUCTS_API_RESPONSES.STOCK_STATUS_RETRIEVED,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: PRODUCTS_API_RESPONSES.PRODUCT_NOT_FOUND,
    })
    async getStockStatus(@Param('id') id: string) {
        this.logger.log(PRODUCTS_LOG_MESSAGES.GETTING_STOCK_STATUS(id));
        return await this.productsService.getStockStatus(id);
    }

    @Post('validate-stock')
    @ApiOperation({ summary: PRODUCTS_OPERATIONS.VALIDATE_STOCK })
    @ApiResponse({
        status: HttpStatus.OK,
        description: PRODUCTS_API_RESPONSES.STOCK_VALIDATION_COMPLETED,
    })
    async validateStock(@Body() validateStockDto: ValidateStockDto) {
        this.logger.log(PRODUCTS_LOG_MESSAGES.VALIDATING_STOCK(validateStockDto.items.length));
        return await this.productsService.validateStockForCheckout(validateStockDto.items);
    }

    @Post('reduce-stock')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: PRODUCTS_OPERATIONS.REDUCE_STOCK })
    @ApiResponse({
        status: HttpStatus.OK,
        description: PRODUCTS_API_RESPONSES.STOCK_REDUCED,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: PRODUCTS_API_RESPONSES.INSUFFICIENT_STOCK_FOR_ITEMS,
    })
    async reduceStock(@Body() reduceStockDto: ReduceStockDto) {
        this.logger.log(PRODUCTS_LOG_MESSAGES.REDUCING_STOCK(reduceStockDto.items.length));
        await this.productsService.reduceStockForOrder(reduceStockDto.items);
        return { message: PRODUCTS_MESSAGES.STOCK_REDUCED_SUCCESSFULLY };
    }
}
