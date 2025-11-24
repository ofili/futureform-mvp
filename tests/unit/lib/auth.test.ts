import bcrypt from 'bcryptjs';

describe('Authentication Utilities', () => {
    describe('Password Hashing', () => {
        it('should hash password correctly', async () => {
            const password = 'TestPassword123!';
            const hash = await bcrypt.hash(password, 10);

            expect(hash).toBeDefined();
            expect(hash).not.toBe(password);
            expect(hash.length).toBeGreaterThan(50);
        });

        it('should verify correct password', async () => {
            const password = 'TestPassword123!';
            const hash = await bcrypt.hash(password, 10);

            const isValid = await bcrypt.compare(password, hash);
            expect(isValid).toBe(true);
        });

        it('should reject incorrect password', async () => {
            const password = 'TestPassword123!';
            const wrongPassword = 'WrongPassword123!';
            const hash = await bcrypt.hash(password, 10);

            const isValid = await bcrypt.compare(wrongPassword, hash);
            expect(isValid).toBe(false);
        });

        it('should generate different hashes for same password', async () => {
            const password = 'TestPassword123!';
            const hash1 = await bcrypt.hash(password, 10);
            const hash2 = await bcrypt.hash(password, 10);

            expect(hash1).not.toBe(hash2);

            // But both should verify correctly
            expect(await bcrypt.compare(password, hash1)).toBe(true);
            expect(await bcrypt.compare(password, hash2)).toBe(true);
        });
    });

    describe('Password Validation', () => {
        const validatePassword = (password: string): boolean => {
            // Minimum 8 characters, at least one uppercase, one lowercase, one number
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            return regex.test(password);
        };

        it('should accept valid password', () => {
            expect(validatePassword('Password123')).toBe(true);
            expect(validatePassword('MyP@ssw0rd')).toBe(true);
            expect(validatePassword('Secure1Pass')).toBe(true);
        });

        it('should reject password without uppercase', () => {
            expect(validatePassword('password123')).toBe(false);
        });

        it('should reject password without lowercase', () => {
            expect(validatePassword('PASSWORD123')).toBe(false);
        });

        it('should reject password without number', () => {
            expect(validatePassword('PasswordOnly')).toBe(false);
        });

        it('should reject password too short', () => {
            expect(validatePassword('Pass1')).toBe(false);
        });
    });

    describe('Email Validation', () => {
        const validateEmail = (email: string): boolean => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        };

        it('should accept valid emails', () => {
            expect(validateEmail('user@example.com')).toBe(true);
            expect(validateEmail('test.user@company.co.uk')).toBe(true);
            expect(validateEmail('admin+tag@domain.org')).toBe(true);
        });

        it('should reject invalid emails', () => {
            expect(validateEmail('notanemail')).toBe(false);
            expect(validateEmail('@example.com')).toBe(false);
            expect(validateEmail('user@')).toBe(false);
            expect(validateEmail('user @example.com')).toBe(false);
        });
    });
});
