import { IsString, IsOptional } from 'class-validator';

export class PaymobWebhookDto {
    @IsString()
    amount_cents: string;

    @IsString()
    created_at: string;

    @IsString()
    currency: string;

    @IsString()
    error_occured: string;

    @IsString()
    has_parent_transaction: string;

    @IsString()
    id: string;

    @IsString()
    integration_id: string;

    @IsString()
    is_3d_secure: string;

    @IsString()
    is_auth: string;

    @IsString()
    is_capture: string;

    @IsString()
    is_refunded: string;

    @IsString()
    is_standalone_payment: string;

    @IsString()
    is_voided: string;

    @IsString()
    order: string;

    @IsString()
    owner: string;

    @IsString()
    pending: string;

    @IsString()
    source_data_pan: string;

    @IsString()
    source_data_sub_type: string;

    @IsString()
    source_data_type: string;

    @IsString()
    success: string;

    @IsString()
    hmac: string;

    @IsOptional()
    obj?: Record<string, unknown>;
}
