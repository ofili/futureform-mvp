// Custom error classes for credit system

export class CreditError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number = 400
    ) {
        super(message);
        this.name = 'CreditError';
    }
}

export class InsufficientCreditsError extends CreditError {
    constructor(creditType: 'RC' | 'EC', required: number, available: number) {
        super(
            `Insufficient ${creditType} credits. Required: ${required}, Available: ${available}`,
            'INSUFFICIENT_CREDITS',
            402 // Payment Required
        );
        this.name = 'InsufficientCreditsError';
    }
}

export class CreditExpiredError extends CreditError {
    constructor(creditType: 'RC' | 'EC') {
        super(
            `${creditType} credits have expired`,
            'CREDITS_EXPIRED',
            410 // Gone
        );
        this.name = 'CreditExpiredError';
    }
}

export class InvalidPackageError extends CreditError {
    constructor(packageId: string) {
        super(
            `Invalid or inactive package: ${packageId}`,
            'INVALID_PACKAGE',
            404
        );
        this.name = 'InvalidPackageError';
    }
}

export class EvidenceValidationError extends Error {
    constructor(message: string, public validationErrors: string[]) {
        super(message);
        this.name = 'EvidenceValidationError';
    }
}

export class PaymentError extends Error {
    constructor(message: string, public paymentProvider?: string) {
        super(message);
        this.name = 'PaymentError';
    }
}
