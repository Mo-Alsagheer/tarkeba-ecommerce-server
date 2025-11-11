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
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';
import { QueryReviewsDto } from './dto/query-reviews.dto';
import {
    API_OPERATIONS,
    API_RESPONSE_MESSAGES,
    API_PARAMS,
} from '../../../../common/constants/api-descriptions';
import type { IAuthenticatedRequest } from '../../../../common/interfaces';
import { JwtAuthGuard } from '../../../identity/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../identity/auth/guards/roles.guard';
import { Roles } from '../../../identity/auth/decorators/roles.decorator';
import { UserRole } from '../../../../common/enums';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: API_OPERATIONS.REVIEWS.CREATE.SUMMARY })
    @ApiResponse({
        status: 201,
        description: API_RESPONSE_MESSAGES.REVIEWS.CREATED,
    })
    @ApiResponse({
        status: 400,
        description: API_RESPONSE_MESSAGES.ERROR.BAD_REQUEST,
    })
    @ApiResponse({ status: 401, description: API_RESPONSE_MESSAGES.ERROR.UNAUTHORIZED })
    create(@Body() createReviewDto: CreateReviewDto, @Request() req: IAuthenticatedRequest) {
        return this.reviewsService.create(createReviewDto, req.user.sub);
    }

    @Get()
    @ApiOperation({ summary: API_OPERATIONS.REVIEWS.FIND_ALL.SUMMARY })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.REVIEWS.RETRIEVED,
    })
    findAll(@Query() queryDto: QueryReviewsDto) {
        return this.reviewsService.findAll(queryDto);
    }

    @Get('product/:productId/stats')
    @ApiOperation({ summary: API_OPERATIONS.REVIEWS.GET_PRODUCT_STATS.SUMMARY })
    @ApiParam({ name: 'productId', description: API_PARAMS.PRODUCT_ID })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.REVIEWS.STATS_RETRIEVED,
    })
    getProductStats(@Param('productId') productId: string) {
        return this.reviewsService.getProductReviewStats(productId);
    }

    @Get(':id')
    @ApiOperation({ summary: API_OPERATIONS.REVIEWS.FIND_ONE.SUMMARY })
    @ApiParam({ name: 'id', description: API_PARAMS.REVIEW_ID })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.SUCCESS.RETRIEVED,
    })
    @ApiResponse({ status: 404, description: API_RESPONSE_MESSAGES.ERROR.NOT_FOUND })
    findOne(@Param('id') id: string) {
        return this.reviewsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: API_OPERATIONS.REVIEWS.UPDATE.SUMMARY })
    @ApiParam({ name: 'id', description: API_PARAMS.REVIEW_ID })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.REVIEWS.UPDATED,
    })
    @ApiResponse({ status: 401, description: API_RESPONSE_MESSAGES.ERROR.UNAUTHORIZED })
    @ApiResponse({ status: 403, description: API_RESPONSE_MESSAGES.ERROR.FORBIDDEN })
    @ApiResponse({ status: 404, description: API_RESPONSE_MESSAGES.ERROR.NOT_FOUND })
    update(
        @Param('id') id: string,
        @Body() updateReviewDto: UpdateReviewDto,
        @Request() req: IAuthenticatedRequest
    ) {
        return this.reviewsService.update(id, updateReviewDto, req.user.sub);
    }

    @Patch(':id/moderate')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: API_OPERATIONS.REVIEWS.MODERATE.SUMMARY })
    @ApiParam({ name: 'id', description: API_PARAMS.REVIEW_ID })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.REVIEWS.MODERATED,
    })
    @ApiResponse({ status: 401, description: API_RESPONSE_MESSAGES.ERROR.UNAUTHORIZED })
    @ApiResponse({ status: 403, description: API_RESPONSE_MESSAGES.ERROR.FORBIDDEN })
    @ApiResponse({ status: 404, description: API_RESPONSE_MESSAGES.ERROR.NOT_FOUND })
    moderate(@Param('id') id: string, @Body() moderateReviewDto: ModerateReviewDto) {
        return this.reviewsService.moderate(id, moderateReviewDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: API_OPERATIONS.REVIEWS.DELETE.SUMMARY })
    @ApiParam({ name: 'id', description: API_PARAMS.REVIEW_ID })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.REVIEWS.DELETED,
    })
    @ApiResponse({ status: 401, description: API_RESPONSE_MESSAGES.ERROR.UNAUTHORIZED })
    @ApiResponse({ status: 403, description: API_RESPONSE_MESSAGES.ERROR.FORBIDDEN })
    @ApiResponse({ status: 404, description: API_RESPONSE_MESSAGES.ERROR.NOT_FOUND })
    remove(@Param('id') id: string, @Request() req: IAuthenticatedRequest) {
        return this.reviewsService.remove(id, req.user.sub);
    }
}
