import {
    Controller,
    Post,
    Body,
    UseGuards,
    Logger,
    Request as RequestDecorator,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { ValidateCartDto, ApplyCouponDto, CheckoutValidationDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../../../identity/auth/guards/jwt-auth.guard';
import {
    CART_LOG_MESSAGES,
    CART_STATUS,
    CART_API_DESCRIPTIONS,
} from '../../../../common/constants/cart.constants';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
    private readonly logger = new Logger(CartController.name);
    constructor(private readonly cartService: CartService) {}

    @Post('validate')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: CART_API_DESCRIPTIONS.VALIDATE_CART.SUMMARY,
        description: CART_API_DESCRIPTIONS.VALIDATE_CART.DESCRIPTION,
    })
    @ApiResponse({
        status: 200,
        description: CART_API_DESCRIPTIONS.VALIDATE_CART.SUCCESS,
    })
    async validateCart(@Body() validateCartDto: ValidateCartDto) {
        this.logger.log(CART_LOG_MESSAGES.VALIDATING_CART);
        const validation = await this.cartService.validateCart(validateCartDto.items);
        const summary = this.cartService.calculateCartSummary(validation.validItems);

        return {
            validation,
            summary,
            status: validation.invalidItems.length > 0 ? CART_STATUS.HAS_ISSUES : CART_STATUS.VALID,
        };
    }

    @Post('enrich')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: CART_API_DESCRIPTIONS.ENRICH_CART.SUMMARY,
        description: CART_API_DESCRIPTIONS.ENRICH_CART.DESCRIPTION,
    })
    @ApiResponse({
        status: 200,
        description: CART_API_DESCRIPTIONS.ENRICH_CART.SUCCESS,
    })
    async enrichCartItems(@Body() validateCartDto: ValidateCartDto) {
        this.logger.log(CART_LOG_MESSAGES.ENRICHING_CART);
        const enrichedItems = await this.cartService.enrichCartItems(validateCartDto.items);
        const summary = this.cartService.calculateCartSummary(enrichedItems);

        return { items: enrichedItems, summary };
    }

    @Post('apply-coupon')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: CART_API_DESCRIPTIONS.APPLY_COUPON.SUMMARY,
        description: CART_API_DESCRIPTIONS.APPLY_COUPON.DESCRIPTION,
    })
    @ApiResponse({
        status: 200,
        description: CART_API_DESCRIPTIONS.APPLY_COUPON.SUCCESS,
    })
    async applyCoupon(
        @Body() applyCouponDto: ApplyCouponDto,
        @RequestDecorator() req: { user: { sub: string } }
    ) {
        this.logger.log(CART_LOG_MESSAGES.APPLYING_COUPON(applyCouponDto.couponCode));
        return await this.cartService.applyCouponWithSummary(
            applyCouponDto.items,
            applyCouponDto.couponCode,
            req.user.sub
        );
    }

    @Post('validate-checkout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: CART_API_DESCRIPTIONS.VALIDATE_CHECKOUT.SUMMARY,
        description: CART_API_DESCRIPTIONS.VALIDATE_CHECKOUT.DESCRIPTION,
    })
    @ApiResponse({
        status: 200,
        description: CART_API_DESCRIPTIONS.VALIDATE_CHECKOUT.SUCCESS,
    })
    async validateCheckout(
        @Body() checkoutDto: CheckoutValidationDto,
        @RequestDecorator() req: { user: { sub: string } }
    ) {
        this.logger.log(CART_LOG_MESSAGES.VALIDATING_CHECKOUT);
        return await this.cartService.validateCompleteCheckout(
            checkoutDto.items,
            checkoutDto.couponCode,
            req.user.sub
        );
    }
}
