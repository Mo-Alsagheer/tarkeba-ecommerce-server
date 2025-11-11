import { Controller, Get, Put, Body, Req, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { API_OPERATIONS, API_RESPONSE_MESSAGES } from '../../../common/constants';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: API_OPERATIONS.AUTH.GET_PROFILE.SUMMARY })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.AUTH.PROFILE_RETRIEVED,
    })
    async getProfile(@Req() req: Request & { user: { userID: string } }) {
        console.log(req.user);
        return this.usersService.getProfile(req.user.userID);
    }

    @Put('profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: API_OPERATIONS.AUTH.UPDATE_PROFILE.SUMMARY })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.AUTH.PROFILE_UPDATED,
    })
    async updateProfile(
        @Req() req: Request & { user: { userID: string } },
        @Body() dto: UpdateProfileDto
    ) {
        return this.usersService.updateProfile(req.user.userID, dto);
    }

    @Get('orders')
    @ApiOperation({ summary: API_OPERATIONS.AUTH.GET_ORDER_HISTORY.SUMMARY })
    @ApiResponse({ status: 200, description: API_RESPONSE_MESSAGES.AUTH.ORDERS_RETRIEVED })
    async getOrderHistory(
        @Req() req: Request & { user: { userID: string } },
        @Query('page') page?: number,
        @Query('limit') limit?: number
    ) {
        return this.usersService.getOrderHistory(req.user.userID, page || 1, limit || 10);
    }
}
