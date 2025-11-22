import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export type UserRole = 'USER' | 'ADMIN'
export type OrganizationRole = 'OWNER' | 'ORG_ADMIN' | 'ADMIN' | 'MEMBER' | 'REVIEWER' | 'DOMAIN_EXPERT' | 'OBSERVER' | 'CREDIT_MANAGER' | 'PROJECT_ADMIN'

/**
 * Check if user has required global role
 */
export function hasGlobalRole(userRole: string, requiredRoles: UserRole[]): boolean {
    return requiredRoles.includes(userRole as UserRole)
}

/**
 * Check if user has required organization role
 */
export function hasOrgRole(orgRole: string | undefined, requiredRoles: OrganizationRole[]): boolean {
    return !!orgRole && requiredRoles.includes(orgRole as OrganizationRole)
}

/**
 * Check if user is admin (Global)
 */
export function isAdmin(userRole: string): boolean {
    return userRole === 'ADMIN'
}

/**
 * Check if user is organization admin (Global Admin OR Org Admin/Owner)
 */
export function isOrgAdmin(user: { role: string, organizationRole?: string }): boolean {
    return user.role === 'ADMIN' || ['OWNER', 'ORG_ADMIN', 'ADMIN'].includes(user.organizationRole || '')
}

/**
 * Check if user is project admin (Global Admin OR Org Admin/Owner OR Project Admin)
 */
export function isProjectAdmin(user: { role: string, organizationRole?: string }): boolean {
    return isOrgAdmin(user) || user.organizationRole === 'PROJECT_ADMIN'
}

/**
 * Middleware helper to require authentication
 */
export async function requireAuth() {
    const session = await auth()

    if (!session) {
        return {
            error: 'Unauthorized',
            status: 401,
            response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
    }

    return { session, error: null, status: 200, response: null }
}

/**
 * Middleware helper to require specific global roles
 */
export async function requireGlobalRole(requiredRoles: UserRole[]) {
    const { session, error, response } = await requireAuth()

    if (error) {
        return { session: null, error, status: 401, response }
    }

    if (!hasGlobalRole(session!.user.role, requiredRoles)) {
        return {
            session: null,
            error: 'Forbidden',
            status: 403,
            response: NextResponse.json({ error: 'Forbidden - Insufficient permissions' }, { status: 403 })
        }
    }

    return { session, error: null, status: 200, response: null }
}

/**
 * Middleware helper to require admin role
 */
export async function requireAdmin() {
    return requireGlobalRole(['ADMIN'])
}

/**
 * Middleware helper to require organization admin permissions
 */
export async function requireOrgAdmin() {
    const { session, error, response } = await requireAuth()

    if (error) return { session: null, error, status: 401, response }

    if (!isOrgAdmin(session!.user)) {
        return {
            session: null,
            error: 'Forbidden',
            status: 403,
            response: NextResponse.json({ error: 'Forbidden - Insufficient permissions' }, { status: 403 })
        }
    }

    return { session, error: null, status: 200, response: null }
}

/**
 * Middleware helper to require project admin permissions
 */
export async function requireProjectAdmin() {
    const { session, error, response } = await requireAuth()

    if (error) return { session: null, error, status: 401, response }

    if (!isProjectAdmin(session!.user)) {
        return {
            session: null,
            error: 'Forbidden',
            status: 403,
            response: NextResponse.json({ error: 'Forbidden - Insufficient permissions' }, { status: 403 })
        }
    }

    return { session, error: null, status: 200, response: null }
}

/**
 * Check if user has permission to access a resource
 */
export interface ResourcePermission {
    userId: string
    resourceOwnerId?: string
    allowedGlobalRoles?: UserRole[]
    allowedOrgRoles?: OrganizationRole[]
    customCheck?: (userId: string, user: { role: string, organizationRole?: string }) => Promise<boolean>
}

export async function checkResourcePermission(
    session: { user: { id: string; role: string; organizationRole?: string } },
    permission: ResourcePermission
): Promise<boolean> {
    const { userId, resourceOwnerId, allowedGlobalRoles, allowedOrgRoles, customCheck } = permission

    // Admin always has access
    if (session.user.role === 'ADMIN') {
        return true
    }

    // Check if user is the resource owner
    if (resourceOwnerId && session.user.id === resourceOwnerId) {
        return true
    }

    // Check global roles
    if (allowedGlobalRoles && hasGlobalRole(session.user.role, allowedGlobalRoles)) {
        return true
    }

    // Check org roles
    if (allowedOrgRoles && hasOrgRole(session.user.organizationRole, allowedOrgRoles)) {
        return true
    }

    // Run custom permission check
    if (customCheck) {
        return await customCheck(session.user.id, session.user)
    }

    return false
}
