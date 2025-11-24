import { NextAuthOptions, getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                console.log('🔐 Auth attempt for:', credentials?.email);

                if (!credentials?.email || !credentials?.password) {
                    console.log('❌ Missing credentials');
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                    include: {
                        organizations: {
                            where: {
                                deletedAt: null // Only include active memberships
                            },
                            take: 1,
                            include: {
                                organization: {
                                    include: {
                                        tier: true
                                    }
                                }
                            }
                        }
                    }
                })

                if (!user) {
                    console.log('❌ User not found in database');
                    return null;
                }

                if (!user.password) {
                    console.log('❌ User has no password set');
                    return null;
                }

                console.log('✅ User found:', user.email);
                console.log('📝 Password hash from DB:', user.password.substring(0, 20) + '...');
                console.log('🔑 Attempting password:', credentials.password);

                const passwordMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                console.log('🔓 Password match result:', passwordMatch);

                if (!passwordMatch) {
                    console.log('❌ Password does not match');
                    return null;
                }

                const org = user.organizations[0];

                console.log('✅ Login successful for:', user.email);

                return {
                    id: user.id,
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                    role: user.role,
                    organizationId: org?.organizationId,
                    organizationRole: org?.role,
                    tier: org?.organization?.tier?.name
                }
            }
        })
    ],
    session: {
        strategy: 'jwt',
        maxAge: 3600 // 1 hour
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
                token.organizationId = user.organizationId
                token.organizationRole = user.organizationRole
                token.tier = user.tier
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
                session.user.organizationId = token.organizationId as string | undefined
                session.user.organizationRole = token.organizationRole as string | undefined
                session.user.tier = token.tier as string | undefined
            }
            return session
        }
    },
    pages: {
        signIn: '/auth/login'
    }
}

export const auth = () => getServerSession(authOptions)
export const getSession = auth;

export async function verifyToken(token: string) {
    // Placeholder for token verification if needed for legacy support
    // In NextAuth, we typically verify session instead
    return true;
}
