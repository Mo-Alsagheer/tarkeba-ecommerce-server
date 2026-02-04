import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';
import crypto from 'crypto';

export interface PaymobConfig {
    apiKey: string;
    baseUrl: string;
    walletIntegrationId: number;
    hmacSecret: string;
}

export interface PaymobWalletPayRequest {
    source: {
        identifier: string;
        subtype: 'WALLET';
    };
    payment_token: string;
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

export interface PaymobCallbackData {
    id: string;
    pending: string;
    amount_cents: string;
    success: string;
    is_auth: string;
    is_capture: string;
    is_refunded: string;
    is_voided: string;
    is_3d_secure: string;
    is_standalone_payment: string;
    order: string;
    integration_id: string;
    currency: string;
    hmac: string;
    created_at: string;
    error_occured: string;
    has_parent_transaction: string;
    owner: string;
    source_data_pan: string;
    source_data_sub_type: string;
    source_data_type: string;
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
            walletIntegrationId: parseInt(
                this.configService.get<string>('PAYMOB_WALLET_INTEGRATION_ID') || '0'
            ),
            hmacSecret: this.configService.get<string>('PAYMOB_HMAC_SECRET') || '',
        };

        if (!this.config.walletIntegrationId || this.config.walletIntegrationId === 0) {
            this.logger.warn('PAYMOB_WALLET_INTEGRATION_ID is not configured.');
        }
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
        } catch (error: any) {
            this.logger.error('Failed to create Paymob order', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            const errorMessage =
                error.response?.data?.detail ||
                error.response?.data?.message ||
                'Failed to create payment order';
            throw new BadRequestException(`Payment order creation failed: ${errorMessage}`);
        }
    }

    async createPaymentKey(paymentKeyData: PaymobPaymentKeyRequest): Promise<string> {
        const token = await this.getAuthToken();

        try {
            this.logger.debug('Creating payment key with data:', {
                amount_cents: paymentKeyData.amount_cents,
                currency: paymentKeyData.currency,
                order_id: paymentKeyData.order_id,
                integration_id: paymentKeyData.integration_id,
                billing_data: {
                    ...paymentKeyData.billing_data,
                    email: paymentKeyData.billing_data.email ? '***' : undefined,
                    phone_number: paymentKeyData.billing_data.phone_number ? '***' : undefined,
                },
            });

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
        } catch (error: any) {
            this.logger.error('Failed to create Paymob payment key', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                requestData: {
                    amount_cents: paymentKeyData.amount_cents,
                    currency: paymentKeyData.currency,
                    order_id: paymentKeyData.order_id,
                    integration_id: paymentKeyData.integration_id,
                },
            });

            // Extract more detailed error information
            let errorMessage = 'Failed to create payment key';
            if (error.response?.data) {
                const responseData = error.response.data;
                if (typeof responseData === 'string') {
                    errorMessage = responseData;
                } else if (responseData.detail) {
                    errorMessage = responseData.detail;
                } else if (responseData.message) {
                    errorMessage = responseData.message;
                } else if (responseData.error) {
                    errorMessage = responseData.error;
                } else {
                    errorMessage = JSON.stringify(responseData);
                }
            }

            throw new BadRequestException(`Payment key creation failed: ${errorMessage}`);
        }
    }

    async payWithWallet(paymentToken: string, walletNumber: string): Promise<string> {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.config.baseUrl}/acceptance/payments/pay`, {
                    source: {
                        identifier: walletNumber,
                        subtype: 'WALLET',
                    },
                    payment_token: paymentToken,
                })
            );

            const redirectUrl = response.data?.redirect_url;
            if (!redirectUrl) {
                this.logger.error('Wallet payment response missing redirect_url', {
                    response: response.data,
                });
                throw new BadRequestException(
                    'Wallet payment failed: missing redirect URL from Paymob. Check integration ID and wallet number format (e.g., 01XXXXXXXXX)'
                );
            }

            return redirectUrl;
        } catch (error: any) {
            this.logger.error('Failed to execute wallet payment request', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            const errorMessage =
                error.response?.data?.detail ||
                error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to execute wallet payment';
            throw new BadRequestException(`Wallet payment failed: ${errorMessage}`);
        }
    }

    async initiateWalletPayment(
        amount: number,
        currency: string,
        orderId: string,
        userEmail: string,
        userName: string,
        walletMsisdn: string
    ): Promise<{
        paymobOrderId: string;
        paymentKey: string;
        redirectUrl: string;
    }> {
        // Validate wallet phone number
        if (!walletMsisdn || walletMsisdn.length < 10) {
            throw new BadRequestException(
                'Valid wallet phone number is required (e.g., 01XXXXXXXXX)'
            );
        }

        // Validate wallet integration ID
        if (!this.config.walletIntegrationId || this.config.walletIntegrationId === 0) {
            throw new BadRequestException(
                'Wallet integration not configured. Please set PAYMOB_WALLET_INTEGRATION_ID in your .env file'
            );
        }

        // Convert amount to cents (Paymob expects amounts in cents)
        const amountCents = Math.round(amount * 100);

        // Create unique merchant order ID to avoid duplicates
        const uniqueMerchantOrderId = `${orderId}_${Date.now()}`;

        // Create Paymob order
        const orderData: PaymobOrderRequest = {
            amount_cents: amountCents,
            currency,
            merchant_order_id: uniqueMerchantOrderId,
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

        // Parse user name
        const nameParts = userName.trim().split(' ');
        const firstName = nameParts[0] || 'Customer';
        const lastName = nameParts.slice(1).join(' ') || 'User';

        // Create payment key
        const paymentKeyData: PaymobPaymentKeyRequest = {
            amount_cents: amountCents,
            expiration: 3600, // 1 hour expiration
            order_id: paymobOrder.id.toString(),
            billing_data: {
                email: userEmail.trim() || 'customer@example.com',
                first_name: firstName,
                last_name: lastName,
                phone_number: walletMsisdn,
                country: 'EG',
                city: 'Cairo',
                street: 'NA',
                building: 'NA',
                floor: 'NA',
                apartment: 'NA',
            },
            currency,
            integration_id: this.config.walletIntegrationId,
            lock_order_when_paid: true,
        };

        const paymentKey = await this.createPaymentKey(paymentKeyData);

        // Call pay API to get redirect URL for wallet OTP
        const redirectUrl = await this.payWithWallet(paymentKey, walletMsisdn);

        return {
            paymobOrderId: paymobOrder.id.toString(),
            paymentKey,
            redirectUrl,
        };
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

    verifyCallbackSignature(callbackData: PaymobCallbackData): boolean {
        // Paymob HMAC calculation for callbacks
        // The order is critical and must match Paymob's specification
        const concatenatedString = [
            callbackData.amount_cents,
            callbackData.created_at,
            callbackData.currency,
            callbackData.error_occured,
            callbackData.has_parent_transaction,
            callbackData.id,
            callbackData.integration_id,
            callbackData.is_3d_secure,
            callbackData.is_auth,
            callbackData.is_capture,
            callbackData.is_refunded,
            callbackData.is_standalone_payment,
            callbackData.is_voided,
            callbackData.order,
            callbackData.owner,
            callbackData.pending,
            callbackData.source_data_pan,
            callbackData.source_data_sub_type,
            callbackData.source_data_type,
            callbackData.success,
        ].join('');

        const calculatedHmac = crypto
            .createHmac('sha512', this.config.hmacSecret)
            .update(concatenatedString)
            .digest('hex');

        return calculatedHmac === callbackData.hmac;
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
