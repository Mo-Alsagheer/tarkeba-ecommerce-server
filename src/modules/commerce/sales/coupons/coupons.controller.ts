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
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ApplyCouponDto, CouponApplicationResult } from './dto/apply-coupon.dto';
import { QueryCouponsDto } from './dto/query-coupons.dto';
import { JwtAuthGuard } from '../../../identity/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../identity/auth/guards/roles.guard';
import { Roles } from '../../../identity/auth/decorators/roles.decorator';
import { UserRole } from '../../../../common/enums';
import type { IAuthenticatedRequest } from '../../../../common/interfaces';
import {
    COUPONS_MESSAGES,
    COUPONS_API_RESPONSES,
    COUPONS_OPERATIONS,
    COUPONS_CONTROLLER_LOG_MESSAGES,
    COUPONS_SWAGGER_PARAMS,
} from '../../../../common/constants';
import {
    CouponResponseDto,
    CouponsListResponseDto,
    CouponApplicationResultDto,
    CouponStatsResponseDto,
    CouponDeleteResponseDto,
} from './dto/coupon-response.dto';
import { Logger } from '@nestjs/common';

@ApiTags('Coupons')
@Controller('coupons')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CouponsController {
    private readonly logger = new Logger(CouponsController.name);
    constructor(private readonly couponsService: CouponsService) {}

    @Post()
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: COUPONS_OPERATIONS.CREATE_COUPON })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: COUPONS_API_RESPONSES.COUPON_CREATED,
        type: CouponResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: COUPONS_API_RESPONSES.COUPON_CODE_EXISTS,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: COUPONS_API_RESPONSES.INVALID_COUPON_DATA,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: COUPONS_API_RESPONSES.UNAUTHORIZED,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: COUPONS_API_RESPONSES.FORBIDDEN_ADMIN_REQUIRED,
    })
    async create(@Body() createCouponDto: CreateCouponDto, @Request() req: IAuthenticatedRequest) {
        this.logger.log(
            `${COUPONS_CONTROLLER_LOG_MESSAGES.CREATING_COUPON}: ${createCouponDto.code}`
        );
        return this.couponsService.create(createCouponDto, req.user.userId);
    }

    @Get()
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: COUPONS_OPERATIONS.GET_ALL_COUPONS })
    @ApiResponse({
        status: HttpStatus.OK,
        description: COUPONS_API_RESPONSES.COUPONS_RETRIEVED,
        type: CouponsListResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: COUPONS_API_RESPONSES.UNAUTHORIZED,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: COUPONS_API_RESPONSES.FORBIDDEN_ADMIN_REQUIRED,
    })
    async findAll(@Query() queryDto: QueryCouponsDto) {
        this.logger.log(COUPONS_CONTROLLER_LOG_MESSAGES.FETCHING_COUPONS);
        return this.couponsService.findAll(queryDto);
    }

    @Get('public')
    @ApiOperation({ summary: COUPONS_OPERATIONS.GET_ACTIVE_COUPONS })
    @ApiResponse({
        status: HttpStatus.OK,
        description: COUPONS_API_RESPONSES.ACTIVE_COUPONS_RETRIEVED,
        type: CouponsListResponseDto,
    })
    async findActivePublic(@Query() queryDto: QueryCouponsDto) {
        this.logger.log(COUPONS_CONTROLLER_LOG_MESSAGES.FETCHING_ACTIVE_COUPONS);
        // Force activeOnly to true for public endpoint
        const publicQuery = { ...queryDto, activeOnly: true };
        return this.couponsService.findAll(publicQuery);
    }

    @Post('apply')
    @ApiOperation({ summary: COUPONS_OPERATIONS.APPLY_COUPON })
    @ApiResponse({
        status: HttpStatus.OK,
        description: COUPONS_API_RESPONSES.COUPON_APPLIED,
        type: CouponApplicationResultDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: COUPONS_API_RESPONSES.INVALID_COUPON_OR_CART,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: COUPONS_API_RESPONSES.UNAUTHORIZED,
    })
    async applyCoupon(
        @Body() applyCouponDto: ApplyCouponDto,
        @Request() req: IAuthenticatedRequest
    ): Promise<CouponApplicationResult> {
        this.logger.log(
            `${COUPONS_CONTROLLER_LOG_MESSAGES.APPLYING_COUPON}: ${applyCouponDto.code}`
        );
        return this.couponsService.applyCoupon(applyCouponDto, req.user.userId);
    }

    @Get('code/:code')
    @ApiOperation({ summary: COUPONS_OPERATIONS.GET_COUPON_BY_CODE })
    @ApiParam(COUPONS_SWAGGER_PARAMS.COUPON_CODE)
    @ApiResponse({
        status: HttpStatus.OK,
        description: COUPONS_API_RESPONSES.COUPON_RETRIEVED,
        type: CouponResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: COUPONS_API_RESPONSES.COUPON_NOT_FOUND,
    })
    async findByCode(@Param('code') code: string) {
        this.logger.log(`${COUPONS_CONTROLLER_LOG_MESSAGES.FETCHING_COUPON_BY_CODE}: ${code}`);
        return this.couponsService.findByCode(code);
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: COUPONS_OPERATIONS.GET_COUPON_BY_ID })
    @ApiParam(COUPONS_SWAGGER_PARAMS.COUPON_ID)
    @ApiResponse({
        status: HttpStatus.OK,
        description: COUPONS_API_RESPONSES.COUPON_RETRIEVED,
        type: CouponResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: COUPONS_API_RESPONSES.COUPON_NOT_FOUND,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: COUPONS_API_RESPONSES.UNAUTHORIZED,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: COUPONS_API_RESPONSES.FORBIDDEN_ADMIN_REQUIRED,
    })
    async findOne(@Param('id') id: string) {
        this.logger.log(`${COUPONS_CONTROLLER_LOG_MESSAGES.FETCHING_COUPON_BY_ID}: ${id}`);
        return this.couponsService.findOne(id);
    }

    @Get(':id/stats')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: COUPONS_OPERATIONS.GET_COUPON_STATS })
    @ApiParam(COUPONS_SWAGGER_PARAMS.COUPON_ID)
    @ApiResponse({
        status: HttpStatus.OK,
        description: COUPONS_API_RESPONSES.STATS_RETRIEVED,
        type: CouponStatsResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: COUPONS_API_RESPONSES.COUPON_NOT_FOUND,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: COUPONS_API_RESPONSES.UNAUTHORIZED,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: COUPONS_API_RESPONSES.FORBIDDEN_ADMIN_REQUIRED,
    })
    async getCouponStats(@Param('id') id: string) {
        this.logger.log(`${COUPONS_CONTROLLER_LOG_MESSAGES.FETCHING_COUPON_STATS}: ${id}`);
        return this.couponsService.getCouponUsageStats(id);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: COUPONS_OPERATIONS.UPDATE_COUPON })
    @ApiParam(COUPONS_SWAGGER_PARAMS.COUPON_ID)
    @ApiResponse({
        status: HttpStatus.OK,
        description: COUPONS_API_RESPONSES.COUPON_UPDATED,
        type: CouponResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: COUPONS_API_RESPONSES.COUPON_NOT_FOUND,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: COUPONS_API_RESPONSES.INVALID_UPDATE_DATA,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: COUPONS_API_RESPONSES.UNAUTHORIZED,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: COUPONS_API_RESPONSES.FORBIDDEN_ADMIN_REQUIRED,
    })
    async update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
        this.logger.log(`${COUPONS_CONTROLLER_LOG_MESSAGES.UPDATING_COUPON}: ${id}`);
        return this.couponsService.update(id, updateCouponDto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: COUPONS_OPERATIONS.DELETE_COUPON })
    @ApiParam(COUPONS_SWAGGER_PARAMS.COUPON_ID)
    @ApiResponse({
        status: HttpStatus.OK,
        description: COUPONS_API_RESPONSES.COUPON_DELETED,
        type: CouponDeleteResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: COUPONS_API_RESPONSES.COUPON_NOT_FOUND,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: COUPONS_API_RESPONSES.UNAUTHORIZED,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: COUPONS_API_RESPONSES.FORBIDDEN_ADMIN_REQUIRED,
    })
    async remove(@Param('id') id: string) {
        this.logger.log(`${COUPONS_CONTROLLER_LOG_MESSAGES.DELETING_COUPON}: ${id}`);
        await this.couponsService.remove(id);
        return { message: COUPONS_MESSAGES.DELETED_SUCCESSFULLY };
    }
}
