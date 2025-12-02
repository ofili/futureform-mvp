/**
 * Evidence File Upload Constraints
 * 
 * These constants define the limits for evidence file uploads in trust assessments.
 */

export const EVIDENCE_CONSTRAINTS = {
    // File Size Limits
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB per file
    MAX_TOTAL_SIZE_PER_QUESTION: 50 * 1024 * 1024, // 50MB per question
    MAX_TOTAL_SIZE_PER_ASSESSMENT: 500 * 1024 * 1024, // 500MB per assessment

    // File Count Limits
    MAX_FILES_PER_QUESTION: 5,
    MAX_FILES_PER_ASSESSMENT: 100,

    // Supported File Types
    ALLOWED_MIME_TYPES: [
        // Documents
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/msword', // .doc

        // Spreadsheets
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv',

        // Images
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',

        // Presentations
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
        'application/vnd.ms-powerpoint', // .ppt

        // Text
        'text/plain',
    ],

    // File Extensions (for display)
    ALLOWED_EXTENSIONS: [
        '.pdf',
        '.doc', '.docx',
        '.xls', '.xlsx', '.csv',
        '.jpg', '.jpeg', '.png', '.gif', '.webp',
        '.ppt', '.pptx',
        '.txt',
    ],
} as const;

export const EVIDENCE_ERROR_MESSAGES = {
    FILE_TOO_LARGE: `File size exceeds ${EVIDENCE_CONSTRAINTS.MAX_FILE_SIZE / 1024 / 1024}MB limit`,
    INVALID_FILE_TYPE: 'File type not supported. Please upload PDF, Word, Excel, or image files.',
    TOO_MANY_FILES_PER_QUESTION: `Maximum ${EVIDENCE_CONSTRAINTS.MAX_FILES_PER_QUESTION} files per question`,
    QUESTION_SIZE_EXCEEDED: `Total file size for this question exceeds ${EVIDENCE_CONSTRAINTS.MAX_TOTAL_SIZE_PER_QUESTION / 1024 / 1024}MB`,
    ASSESSMENT_SIZE_EXCEEDED: `Total file size for this assessment exceeds ${EVIDENCE_CONSTRAINTS.MAX_TOTAL_SIZE_PER_ASSESSMENT / 1024 / 1024}MB`,
    ASSESSMENT_FILE_LIMIT: `Maximum ${EVIDENCE_CONSTRAINTS.MAX_FILES_PER_ASSESSMENT} files per assessment`,
} as const;
