import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { PaymentMethod } from '../entities/payment.entity';
import crypto from 'crypto';

export interface PaymobConfig {
    apiKey: string;
    baseUrl: string;
    integrationIds: {
        visa: number;
        mastercard: number;
        vodafoneCash: number;
        orangeCash: number;
        etisalatCash: number;
        wePay: number;
    };
    iframeId: number;
    hmacSecret: string;
}

export interface PaymobOrderRequest {
    amount_cents: number;
    currency: string;
    merchant_order_id: string;
    items: Array<{
        name: string;
        amount_cents: number;
        description: string;
        quantity: number;
    }>;
}

export interface PaymobPaymentKeyRequest {
    amount_cents: number;
    expiration: number;
    order_id: string;
    billing_data: {
        apartment?: string;
        email: string;
        floor?: string;
        first_name: string;
        street?: string;
        building?: string;
        phone_number: string;
        shipping_method?: string;
        postal_code?: string;
        city?: string;
        country?: string;
        last_name: string;
        state?: string;
    };
    currency: string;
    integration_id: number;
    lock_order_when_paid?: boolean;
}

export interface PaymobAuthResponse {
    token: string;
}

export interface PaymobOrderResponse {
    id: number;
    created_at: string;
    delivery_needed: boolean;
    amount_cents: number;
    currency: string;
    merchant_order_id: string;
}

export interface PaymobPaymentKeyResponse {
    token: string;
}

export interface PaymobTransactionResponse {
    id: number;
    pending: boolean;
    amount_cents: number;
    success: boolean;
    is_auth: boolean;
    is_capture: boolean;
    is_standalone_payment: boolean;
    is_voided: boolean;
    is_refunded: boolean;
    is_3d_secure: boolean;
    integration_id: number;
    profile_id: number;
    has_parent_transaction: boolean;
    order: number;
    created_at: string;
    currency: string;
    source_data: {
        type: string;
        pan: string;
        sub_type: string;
    };
}

@Injectable()
export class PaymobService {
    private readonly logger = new Logger(PaymobService.name);
    private readonly config: PaymobConfig;
    private authToken: string | null = null;
    private tokenExpiresAt: Date | null = null;

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
    ) {
        this.config = {
            apiKey: this.configService.get<string>('PAYMOB_API_KEY') || '',
            baseUrl:
                this.configService.get<string>('PAYMOB_BASE_URL') ||
                'https://accept.paymob.com/api',
            integrationIds: {
                visa: parseInt(this.configService.get<string>('PAYMOB_VISA_INTEGRATION_ID') || '0'),
                mastercard: parseInt(
                    this.configService.get<string>('PAYMOB_MASTERCARD_INTEGRATION_ID') || '0'
                ),
                vodafoneCash: parseInt(
                    this.configService.get<string>('PAYMOB_VODAFONE_CASH_INTEGRATION_ID') || '0'
                ),
                orangeCash: parseInt(
                    this.configService.get<string>('PAYMOB_ORANGE_CASH_INTEGRATION_ID') || '0'
                ),
                etisalatCash: parseInt(
                    this.configService.get<string>('PAYMOB_ETISALAT_CASH_INTEGRATION_ID') || '0'
                ),
                wePay: parseInt(
                    this.configService.get<string>('PAYMOB_WE_PAY_INTEGRATION_ID') || '0'
                ),
            },
            iframeId: parseInt(this.configService.get<string>('PAYMOB_IFRAME_ID') || '0'),
            hmacSecret: this.configService.get<string>('PAYMOB_HMAC_SECRET') || '',
        };
    }

    private async getAuthToken(): Promise<string> {
        if (this.authToken && this.tokenExpiresAt && new Date() < this.tokenExpiresAt) {
            return this.authToken;
        }

        try {
            const response: AxiosResponse<PaymobAuthResponse> = await firstValueFrom(
                this.httpService.post<PaymobAuthResponse>(`${this.config.baseUrl}/auth/tokens`, {
                    api_key: this.config.apiKey,
                })
            );

            const token = response.data.token;
            this.authToken = token;
            // Paymob tokens typically expire after 1 hour, set expiry to 50 minutes for safety
            this.tokenExpiresAt = new Date(Date.now() + 50 * 60 * 1000);

            return token;
        } catch (error: unknown) {
            this.logger.error('Failed to authenticate with Paymob', error);
            throw new BadRequestException('Payment service authentication failed');
        }
    }

    private getIntegrationId(paymentMethod: PaymentMethod): number {
        const integrationMap = {
            [PaymentMethod.VISA]: this.config.integrationIds.visa,
            [PaymentMethod.MASTERCARD]: this.config.integrationIds.mastercard,
            [PaymentMethod.VODAFONE_CASH]: this.config.integrationIds.vodafoneCash,
            [PaymentMethod.ORANGE_CASH]: this.config.integrationIds.orangeCash,
            [PaymentMethod.ETISALAT_CASH]: this.config.integrationIds.etisalatCash,
            [PaymentMethod.WE_PAY]: this.config.integrationIds.wePay,
            [PaymentMethod.BANK_TRANSFER]: this.config.integrationIds.visa, // Default to visa integration
        };

        const integrationId = integrationMap[paymentMethod];
        if (!integrationId) {
            throw new BadRequestException(
                `Integration ID not configured for payment method: ${paymentMethod}`
            );
        }

        return integrationId;
    }

    async createOrder(orderData: PaymobOrderRequest): Promise<PaymobOrderResponse> {
        const token = await this.getAuthToken();

        try {
            const response: AxiosResponse<PaymobOrderResponse> = await firstValueFrom(
                this.httpService.post<PaymobOrderResponse>(
                    `${this.config.baseUrl}/ecommerce/orders`,
                    {
                        auth_token: token,
                        delivery_needed: false,
                        ...orderData,
                    }
                )
            );

            return response.data;
        } catch (error: unknown) {
            this.logger.error('Failed to create Paymob order', error);
            throw new BadRequestException('Failed to create payment order');
        }
    }

    async createPaymentKey(paymentKeyData: PaymobPaymentKeyRequest): Promise<string> {
        const token = await this.getAuthToken();

        try {
            const response: AxiosResponse<PaymobPaymentKeyResponse> = await firstValueFrom(
                this.httpService.post<PaymobPaymentKeyResponse>(
                    `${this.config.baseUrl}/acceptance/payment_keys`,
                    {
                        auth_token: token,
                        ...paymentKeyData,
                    }
                )
            );

            return response.data.token;
        } catch (error: unknown) {
            this.logger.error('Failed to create Paymob payment key', error);
            throw new BadRequestException('Failed to create payment key');
        }
    }

    async initiatePayment(
        amount: number,
        currency: string,
        paymentMethod: PaymentMethod,
        orderId: string,
        userEmail: string,
        userPhone: string,
        userName: string,
        walletMsisdn?: string
    ): Promise<{
        paymobOrderId: string;
        paymentKey: string;
        iframeUrl?: string;
        redirectUrl?: string;
    }> {
        // Convert amount to cents (Paymob expects amounts in cents)
        const amountCents = Math.round(amount * 100);

        // Create Paymob order
        const orderData: PaymobOrderRequest = {
            amount_cents: amountCents,
            currency,
            merchant_order_id: orderId,
            items: [
                {
                    name: `Order ${orderId}`,
                    amount_cents: amountCents,
                    description: `Payment for order ${orderId}`,
                    quantity: 1,
                },
            ],
        };

        const paymobOrder = await this.createOrder(orderData);

        // Get integration ID for payment method
        const integrationId = this.getIntegrationId(paymentMethod);

        // Create payment key
        const paymentKeyData: PaymobPaymentKeyRequest = {
            amount_cents: amountCents,
            expiration: 3600, // 1 hour expiration
            order_id: paymobOrder.id.toString(),
            billing_data: {
                email: userEmail,
                first_name: userName.split(' ')[0] || 'Customer',
                last_name: userName.split(' ').slice(1).join(' ') || 'User',
                phone_number: walletMsisdn || userPhone,
                country: 'EG',
                city: 'Cairo',
            },
            currency,
            integration_id: integrationId,
            lock_order_when_paid: true,
        };

        const paymentKey = await this.createPaymentKey(paymentKeyData);

        const result = {
            paymobOrderId: paymobOrder.id.toString(),
            paymentKey,
            iframeUrl: undefined as string | undefined,
            redirectUrl: undefined as string | undefined,
        };

        // Generate appropriate URLs based on payment method
        if (this.isCardPayment(paymentMethod)) {
            result.iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${this.config.iframeId}?payment_token=${paymentKey}`;
        } else if (this.isWalletPayment(paymentMethod)) {
            result.redirectUrl = `https://accept.paymob.com/api/acceptance/payments/pay?payment_token=${paymentKey}`;
        } else if (paymentMethod === PaymentMethod.BANK_TRANSFER) {
            result.redirectUrl = `https://accept.paymob.com/api/acceptance/payments/pay?payment_token=${paymentKey}`;
        }

        return result;
    }

    private isCardPayment(paymentMethod: PaymentMethod): boolean {
        return [PaymentMethod.VISA, PaymentMethod.MASTERCARD].includes(paymentMethod);
    }

    private isWalletPayment(paymentMethod: PaymentMethod): boolean {
        return [
            PaymentMethod.VODAFONE_CASH,
            PaymentMethod.ORANGE_CASH,
            PaymentMethod.ETISALAT_CASH,
            PaymentMethod.WE_PAY,
        ].includes(paymentMethod);
    }

    verifyWebhookSignature(
        amount: string,
        created_at: string,
        currency: string,
        error_occured: string,
        has_parent_transaction: string,
        id: string,
        integration_id: string,
        is_3d_secure: string,
        is_auth: string,
        is_capture: string,
        is_refunded: string,
        is_standalone_payment: string,
        is_voided: string,
        order_id: string,
        owner: string,
        pending: string,
        source_data_pan: string,
        source_data_sub_type: string,
        source_data_type: string,
        success: string,
        receivedHmac: string
    ): boolean {
        const concatenatedString = [
            amount,
            created_at,
            currency,
            error_occured,
            has_parent_transaction,
            id,
            integration_id,
            is_3d_secure,
            is_auth,
            is_capture,
            is_refunded,
            is_standalone_payment,
            is_voided,
            order_id,
            owner,
            pending,
            source_data_pan,
            source_data_sub_type,
            source_data_type,
            success,
        ].join('');

        const calculatedHmac = crypto
            .createHmac('sha512', this.config.hmacSecret)
            .update(concatenatedString)
            .digest('hex');

        return calculatedHmac === receivedHmac;
    }

    async getTransactionDetails(transactionId: string): Promise<PaymobTransactionResponse> {
        const token = await this.getAuthToken();

        try {
            const response: AxiosResponse<PaymobTransactionResponse> = await firstValueFrom(
                this.httpService.get<PaymobTransactionResponse>(
                    `${this.config.baseUrl}/acceptance/transactions/${transactionId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
            );

            return response.data;
        } catch (error: unknown) {
            this.logger.error(`Failed to get transaction details for ${transactionId}`, error);
            throw new BadRequestException('Failed to retrieve transaction details');
        }
    }
}
