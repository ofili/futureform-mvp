
export interface ValidationResult {
    isValid: boolean;
    score: number; // 0-100
    flags: string[];
    metadata: {
        fileType: string;
        fileSize: number;
        detectedDate?: string;
    };
}

export class ValidationService {
    static validateEvidence(file: { name: string; size: number; type: string }, context?: any): ValidationResult {
        const flags: string[] = [];
        let score = 100;

        // Rule 1: File Type Check
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            flags.push('Invalid file format. Preferred: PDF, DOCX, JPG, PNG.');
            score -= 20;
        }

        // Rule 2: File Size Check (Too small might be empty/corrupt)
        if (file.size < 1024) { // < 1KB
            flags.push('File size is suspiciously small (< 1KB).');
            score -= 30;
        }

        // Rule 3: File Size Check (Too large)
        if (file.size > 10 * 1024 * 1024) { // > 10MB
            flags.push('File size exceeds recommended limit (10MB).');
            score -= 5;
        }

        // Rule 4: Naming Convention (Heuristic)
        if (file.name.toLowerCase().includes('untitled') || file.name.toLowerCase().includes('screenshot')) {
            flags.push('Generic filename detected. Please use descriptive names.');
            score -= 10;
        }

        // Rule 5: Context Check (if provided)
        if (context?.requiredKeywords) {
            // This would require actual content extraction, which we are simulating
            // For now, we just check if the filename contains any keyword as a proxy
            const hasKeyword = context.requiredKeywords.some((kw: string) => file.name.toLowerCase().includes(kw.toLowerCase()));
            if (!hasKeyword) {
                flags.push('Filename does not contain expected keywords.');
                score -= 10;
            }
        }

        return {
            isValid: score > 50,
            score: Math.max(0, score),
            flags,
            metadata: {
                fileType: file.type,
                fileSize: file.size,
                detectedDate: new Date().toISOString() // Simulated extraction
            }
        };
    }
}
