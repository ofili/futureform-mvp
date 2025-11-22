import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
    interface Session {
        user: {
            id: string
            email: string
            name: string
            role: string
            organizationId?: string
            organizationRole?: string
            tier?: string // Tier name or ID
        }
    }

    interface User {
        id: string
        email: string
        name: string
        role: string
        organizationId?: string
        organizationRole?: string
        tier?: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string
        role: string
        organizationId?: string
        organizationRole?: string
        tier?: string
    }
}
