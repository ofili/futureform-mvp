// Package Service
// Handles credit package management

import prisma from '@/lib/prisma';
import { InvalidPackageError } from '@/lib/errors/credit-errors';
import { logger } from '@/lib/logger';
import { PackageType, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface CreditPackageInfo {
    id: string;
    name: string;
    displayName: string;
    type: PackageType;
    rcAmount?: number;
    rcPrice?: Decimal;
    ecAmount?: Decimal;
    ecPrice?: Decimal;
    rcIncluded?: number;
    ecIncluded?: Decimal;
    totalPrice?: Decimal;
    description?: string;
    features: string[];
    bestFor?: string;
    popular: boolean;
    billingPeriod?: string;
}

export class PackageService {
    /**
     * Get all available packages
     */
    async getAvailablePackages(type?: PackageType): Promise<CreditPackageInfo[]> {
        const packages = await prisma.creditPackage.findMany({
            where: {
                isActive: true,
                ...(type && { type }),
            },
            orderBy: { displayOrder: 'asc' },
        });

        return packages.map((pkg) => ({
            id: pkg.id,
            name: pkg.name,
            displayName: pkg.displayName,
            type: pkg.type,
            rcAmount: pkg.rcAmount || undefined,
            rcPrice: pkg.rcPrice || undefined,
            ecAmount: pkg.ecAmount || undefined,
            ecPrice: pkg.ecPrice || undefined,
            rcIncluded: pkg.rcIncluded || undefined,
            ecIncluded: pkg.ecIncluded || undefined,
            totalPrice: pkg.totalPrice || undefined,
            description: pkg.description || undefined,
            features: pkg.features,
            bestFor: pkg.bestFor || undefined,
            popular: pkg.popular,
            billingPeriod: pkg.billingPeriod || undefined,
        }));
    }

    /**
     * Get package by ID
     */
    async getPackageById(packageId: string): Promise<CreditPackageInfo> {
        const pkg = await prisma.creditPackage.findUnique({
            where: { id: packageId },
        });

        if (!pkg || !pkg.isActive) {
            throw new InvalidPackageError(packageId);
        }

        return {
            id: pkg.id,
            name: pkg.name,
            displayName: pkg.displayName,
            type: pkg.type,
            rcAmount: pkg.rcAmount || undefined,
            rcPrice: pkg.rcPrice || undefined,
            ecAmount: pkg.ecAmount || undefined,
            ecPrice: pkg.ecPrice || undefined,
            rcIncluded: pkg.rcIncluded || undefined,
            ecIncluded: pkg.ecIncluded || undefined,
            totalPrice: pkg.totalPrice || undefined,
            description: pkg.description || undefined,
            features: pkg.features,
            bestFor: pkg.bestFor || undefined,
            popular: pkg.popular,
            billingPeriod: pkg.billingPeriod || undefined,
        };
    }

    /**
     * Get RC-only packages
     */
    async getRCPackages(): Promise<CreditPackageInfo[]> {
        return this.getAvailablePackages(PackageType.RC_ONLY);
    }

    /**
     * Get EC-only packages
     */
    async getECPackages(): Promise<CreditPackageInfo[]> {
        return this.getAvailablePackages(PackageType.EC_ONLY);
    }

    /**
     * Get combined packages
     */
    async getCombinedPackages(): Promise<CreditPackageInfo[]> {
        return this.getAvailablePackages(PackageType.COMBINED);
    }

    /**
     * Get subscription packages
     */
    async getSubscriptionPackages(): Promise<CreditPackageInfo[]> {
        return this.getAvailablePackages(PackageType.SUBSCRIPTION);
    }
}

// Export singleton instance
export const packageService = new PackageService();
