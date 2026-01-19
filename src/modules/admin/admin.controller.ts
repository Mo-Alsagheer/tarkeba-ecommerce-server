import { Controller, Get, Delete, Param, Query, UseGuards, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../identity/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../identity/auth/guards/roles.guard';
import { Roles } from '../identity/auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums';
import { API_OPERATIONS, API_RESPONSE_MESSAGES, API_DESCRIPTIONS } from '../../common/constants';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
    private readonly logger = new Logger(AdminController.name);
    constructor(private readonly adminService: AdminService) {}

    @Get('dashboard')
    @ApiOperation({
        summary: API_OPERATIONS.ADMIN.GET_DASHBOARD_ANALYTICS.SUMMARY,
        description: API_OPERATIONS.ADMIN.GET_DASHBOARD_ANALYTICS.DESCRIPTION,
    })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.ADMIN.DASHBOARD_ANALYTICS_RETRIEVED,
    })
    async getDashboardAnalytics() {
        this.logger.log(this.adminService.getDashboardAnalytics());
        return this.adminService.getDashboardAnalytics();
    }

    @Get('users')
    @ApiOperation({ summary: API_OPERATIONS.ADMIN.GET_ALL_USERS.SUMMARY })
    @ApiResponse({ status: 200, description: API_RESPONSE_MESSAGES.ADMIN.USERS_LIST_RETRIEVED })
    async getAllUsers(@Query('page') page?: number, @Query('limit') limit?: number) {
        return this.adminService.getAllUsers(page || 1, limit || 10);
    }

    @Delete('users/:id')
    @ApiOperation({ summary: API_OPERATIONS.ADMIN.DELETE_USER.SUMMARY })
    @ApiParam({ name: 'id', description: API_DESCRIPTIONS.ADMIN.DELETE_USER })
    @ApiResponse({ status: 200, description: API_RESPONSE_MESSAGES.ADMIN.USER_DELETED })
    @ApiResponse({ status: 404, description: API_RESPONSE_MESSAGES.ADMIN.USER_NOT_FOUND })
    async deleteUser(@Param('id') id: string) {
        return this.adminService.deleteUser(id);
    }

    @Get('analytics/sales')
    @ApiOperation({
        summary: API_OPERATIONS.ADMIN.GET_SALES_ANALYTICS.SUMMARY,
        description: API_OPERATIONS.ADMIN.GET_SALES_ANALYTICS.DESCRIPTION,
    })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.ADMIN.SALES_ANALYTICS_RETRIEVED,
    })
    async getSalesAnalytics(@Query('days') days?: number) {
        return this.adminService.getSalesAnalytics(days || 30);
    }

    @Get('analytics/top-products')
    @ApiOperation({ summary: API_OPERATIONS.ADMIN.GET_TOP_PRODUCTS.SUMMARY })
    @ApiResponse({ status: 200, description: API_RESPONSE_MESSAGES.ADMIN.TOP_PRODUCTS_RETRIEVED })
    async getTopProducts(@Query('limit') limit?: number) {
        return this.adminService.getTopProducts(limit || 10);
    }

    @Get('analytics/user-growth')
    @ApiOperation({ summary: API_OPERATIONS.ADMIN.GET_USER_GROWTH.SUMMARY })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.ADMIN.USER_GROWTH_RETRIEVED,
    })
    async getUserGrowth(@Query('days') days?: number) {
        return this.adminService.getUserGrowth(days || 30);
    }

    @Get('analytics/order-status')
    @ApiOperation({ summary: API_OPERATIONS.ADMIN.GET_ORDER_STATUS_BREAKDOWN.SUMMARY })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.ADMIN.ORDER_STATUS_BREAKDOWN_RETRIEVED,
    })
    async getOrderStatusBreakdown() {
        return this.adminService.getOrderStatusBreakdown();
    }
}
