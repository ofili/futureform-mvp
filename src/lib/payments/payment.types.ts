// Payment type definitions for Flutterwave integration

export enum PaymentType {
    TIER_UPGRADE = 'TIER_UPGRADE',
    RC_PURCHASE = 'RC_PURCHASE',
    EC_PURCHASE = 'EC_PURCHASE',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED',
}

export interface PaymentMetadata {
    organizationId: string;
    userId: string;
    type: PaymentType;
    tierId?: string;
    packageId?: string;
    packageName?: string;
    creditAmount?: number;
}

export interface PaymentInitRequest {
    type: PaymentType;
    organizationId: string;
    amount: number;
    currency?: 'NGN' | 'USD' | 'GBP' | 'EUR';
    tierId?: string;
    packageId?: string;
    customerEmail: string;
    customerName: string;
    customerPhone?: string;
}

export interface PaymentInitResponse {
    success: boolean;
    paymentLink: string;
    transactionRef: string;
    transactionId: string;
    expiresAt: string;
}

export interface FlutterwavePaymentData {
    tx_ref: string;
    amount: number;
    currency: string;
    redirect_url: string;
    customer: {
        email: string;
        name: string;
        phonenumber?: string;
    };
    customizations: {
        title: string;
        description: string;
        logo?: string;
    };
    meta: PaymentMetadata;
}

export interface FlutterwaveVerifyResponse {
    status: string;
    message: string;
    data: {
        id: number;
        tx_ref: string;
        flw_ref: string;
        amount: number;
        currency: string;
        charged_amount: number;
        status: 'successful' | 'failed' | 'pending';
        payment_type: string;
        created_at: string;
        customer: {
            id: number;
            name: string;
            email: string;
            phone_number: string;
        };
        meta: PaymentMetadata;
    };
}

export interface WebhookPayload {
    event: 'charge.completed' | 'charge.failed' | 'refund.completed';
    data: {
        id: number;
        tx_ref: string;
        flw_ref: string;
        amount: number;
        currency: string;
        charged_amount: number;
        status: string;
        payment_type: string;
        created_at: string;
        customer: {
            id: number;
            name: string;
            email: string;
            phone_number: string;
        };
        meta?: PaymentMetadata;
    };
}

export interface PaymentVerificationRequest {
    transactionRef: string;
    transactionId?: number;
}

export interface PaymentVerificationResponse {
    success: boolean;
    status: PaymentStatus;
    transaction: {
        id: string;
        amount: number;
        currency: string;
        type: PaymentType;
        metadata: PaymentMetadata;
        completedAt?: Date;
        failureReason?: string;
    };
}
