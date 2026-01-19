import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Req,
    Query,
    Put,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import type { IAuthenticatedRequest } from '../../../../common/interfaces';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { CheckoutDto } from './dto/checkout.dto';
import { JwtAuthGuard } from '../../../identity/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../identity/auth/guards/roles.guard';
import { Roles } from '../../../identity/auth/decorators/roles.decorator';
import { UserRole } from '../../../../common/enums';
import {
    ORDERS_OPERATIONS,
    ORDERS_API_RESPONSES,
    ORDERS_CONTROLLER_LOG_MESSAGES,
} from '../../../../common/constants';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
    private readonly logger = new Logger(OrdersController.name);
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: ORDERS_OPERATIONS.CREATE_ORDER })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: ORDERS_API_RESPONSES.ORDER_CREATED,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: ORDERS_API_RESPONSES.INVALID_INPUT_DATA,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: ORDERS_API_RESPONSES.UNAUTHORIZED,
    })
    async create(@Body() createOrderDto: CreateOrderDto, @Req() req: IAuthenticatedRequest) {
        this.logger.log(`${ORDERS_CONTROLLER_LOG_MESSAGES.CREATING_ORDER}: ${req.user.userId}`);
        return this.ordersService.create({
            ...createOrderDto,
            userID: req.user.userId,
        });
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: ORDERS_OPERATIONS.GET_ALL_ORDERS })
    @ApiResponse({
        status: HttpStatus.OK,
        description: ORDERS_API_RESPONSES.ORDERS_RETRIEVED,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: ORDERS_API_RESPONSES.UNAUTHORIZED,
    })
    async findAll(@Req() req: IAuthenticatedRequest, @Query() query: QueryOrderDto) {
        this.logger.log(`${ORDERS_CONTROLLER_LOG_MESSAGES.FETCHING_ORDERS}: ${req.user.userId}`);
        return this.ordersService.findAll({ ...query, userID: req.user.userId });
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: ORDERS_OPERATIONS.GET_ORDER_BY_ID })
    @ApiResponse({
        status: HttpStatus.OK,
        description: ORDERS_API_RESPONSES.ORDER_RETRIEVED,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: ORDERS_API_RESPONSES.ORDER_NOT_FOUND,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: ORDERS_API_RESPONSES.UNAUTHORIZED,
    })
    async findOne(@Param('id') id: string, @Req() req: IAuthenticatedRequest) {
        this.logger.log(
            `${ORDERS_CONTROLLER_LOG_MESSAGES.FETCHING_ORDER_BY_ID}: ${id} (user: ${req.user.userId})`
        );
        return this.ordersService.findOne(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: ORDERS_OPERATIONS.UPDATE_ORDER })
    @ApiResponse({
        status: HttpStatus.OK,
        description: ORDERS_API_RESPONSES.ORDER_UPDATED,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: ORDERS_API_RESPONSES.ORDER_NOT_FOUND,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: ORDERS_API_RESPONSES.UNAUTHORIZED,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: ORDERS_API_RESPONSES.FORBIDDEN_ACCESS,
    })
    async update(
        @Param('id') id: string,
        @Body() updateOrderDto: UpdateOrderDto,
        @Req() req: IAuthenticatedRequest
    ) {
        this.logger.log(
            `${ORDERS_CONTROLLER_LOG_MESSAGES.UPDATING_ORDER}: ${id} (user: ${req.user.userId})`
        );
        return this.ordersService.update(id, updateOrderDto);
    }

    // ==================== CHECKOUT ENDPOINT ====================

    @Post('checkout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: ORDERS_OPERATIONS.CHECKOUT })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: ORDERS_API_RESPONSES.CHECKOUT_COMPLETED,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: ORDERS_API_RESPONSES.INVALID_INPUT_DATA,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: ORDERS_API_RESPONSES.UNAUTHORIZED,
    })
    async checkout(@Body() checkoutDto: CheckoutDto, @Req() req: IAuthenticatedRequest) {
        this.logger.log(
            `${ORDERS_CONTROLLER_LOG_MESSAGES.PROCESSING_CHECKOUT}: ${req.user.userId}`
        );
        const result = await this.ordersService.checkout(req.user.userId, checkoutDto);

        // Return structured response with payment instructions
        return {
            success: true,
            order: result.order,
            paymentRequired: result.paymentRequired,
            paymentMethod: result.paymentMethod,
            message: result.message,
            // If payment is required, provide the orderID for the payment endpoint
            ...(result.paymentRequired && {
                nextStep: {
                    action: 'createPayment',
                    endpoint: '/api/payments',
                    method: 'POST',
                    payload: {
                        orderID: (result.order as any)._id.toString(),
                        amount: result.order.totalAmount,
                        currency: 'EGP',
                        paymentMethod: checkoutDto.paymentMethod,
                        ...(checkoutDto.walletMsisdn && {
                            walletMsisdn: checkoutDto.walletMsisdn,
                        }),
                    },
                },
            }),
        };
    }
}
