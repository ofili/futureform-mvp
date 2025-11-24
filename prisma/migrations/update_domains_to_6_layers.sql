-- Update Questions table domain values
UPDATE "questions" SET domain = 'SYSTEM_RELIABILITY' WHERE domain = 'RELIABILITY';
UPDATE "questions" SET domain = 'OPERATIONAL_TRANSPARENCY' WHERE domain = 'TRANSPARENCY';
UPDATE "questions" SET domain = 'GOVERNANCE_ACCOUNTABILITY' WHERE domain = 'GOVERNANCE';
UPDATE "questions" SET domain = 'ORGANIZATIONAL_COMPETENCE' WHERE domain = 'COMPETENCE';
UPDATE "questions" SET domain = 'VENDOR_INTEGRITY' WHERE domain = 'INTEGRITY';

-- Update DomainScores table domain values
UPDATE "domain_scores" SET domain = 'SYSTEM_RELIABILITY' WHERE domain = 'RELIABILITY';
UPDATE "domain_scores" SET domain = 'OPERATIONAL_TRANSPARENCY' WHERE domain = 'TRANSPARENCY';
UPDATE "domain_scores" SET domain = 'GOVERNANCE_ACCOUNTABILITY' WHERE domain = 'GOVERNANCE';
UPDATE "domain_scores" SET domain = 'ORGANIZATIONAL_COMPETENCE' WHERE domain = 'COMPETENCE';
UPDATE "domain_scores" SET domain = 'VENDOR_INTEGRITY' WHERE domain = 'INTEGRITY';
