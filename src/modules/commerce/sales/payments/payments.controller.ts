import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Query,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { QueryPaymentsDto } from './dto/query-payments.dto';
import { PaymobWebhookDto } from './dto/webhook-payment.dto';
import { JwtAuthGuard } from '../../../identity/auth/guards/jwt-auth.guard';
import type { IAuthenticatedRequest } from '../../../../common/interfaces';
import { RolesGuard } from '../../../identity/auth/guards/roles.guard';
import { Roles } from '../../../identity/auth/decorators/roles.decorator';
import { UserRole } from '../../../../common/enums';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createPaymentDto: CreatePaymentDto, @Request() req: IAuthenticatedRequest) {
        return this.paymentsService.create(createPaymentDto, req.user.sub);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    findAll(@Query() queryDto: QueryPaymentsDto) {
        return this.paymentsService.findAll(queryDto);
    }

    @Get('methods')
    getPaymentMethods() {
        return this.paymentsService.getPaymentMethods();
    }

    @Get('my-payments')
    @UseGuards(JwtAuthGuard)
    findMyPayments(@Query() queryDto: QueryPaymentsDto, @Request() req: IAuthenticatedRequest) {
        queryDto.userId = req.user.sub;
        return this.paymentsService.findAll(queryDto);
    }

    @Get('stats')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    getStats(@Query('userId') userId?: string) {
        return this.paymentsService.getPaymentStats(userId);
    }

    @Get('order/:orderId')
    @UseGuards(JwtAuthGuard)
    findByOrderId(@Param('orderId') orderId: string) {
        return this.paymentsService.findByOrderId(orderId);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id') id: string) {
        return this.paymentsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
        return this.paymentsService.update(id, updatePaymentDto);
    }

    @Post(':id/refund')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    refund(@Param('id') id: string, @Body('reason') reason?: string) {
        return this.paymentsService.refund(id, reason);
    }

    @Post('webhook/paymob')
    @HttpCode(HttpStatus.OK)
    handlePaymobWebhook(@Body() webhookData: PaymobWebhookDto) {
        return this.paymentsService.handleWebhook(webhookData);
    }

    @Get('callback/paymob')
    @HttpCode(HttpStatus.OK)
    async handlePaymobCallback(@Query() callbackData: any) {
        const result = await this.paymentsService.handleCallback(callbackData);
        
        // Redirect user to appropriate page based on payment status
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
        
        if (result.success) {
            return {
                ...result,
                redirectUrl: `${baseUrl}/orders/${result.orderId}/success`,
            };
        } else {
            return {
                ...result,
                redirectUrl: `${baseUrl}/orders/${result.orderId}/failed`,
            };
        }
    }
}
