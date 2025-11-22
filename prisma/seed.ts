import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const questions = [
    // Reliability
    {
        domain: 'RELIABILITY',
        category: 'Uptime & Availability',
        text: 'Can you provide evidence of your system uptime over the last 12 months?',
        helpText: 'Upload uptime logs, status page reports, or SLA compliance reports.',
        order: 1,
    },
    {
        domain: 'RELIABILITY',
        category: 'Incident Management',
        text: 'How do you handle critical incidents? Provide your incident response plan.',
        helpText: 'Upload your Incident Response Plan (IRP) or post-mortem templates.',
        order: 2,
    },
    {
        domain: 'RELIABILITY',
        category: 'Disaster Recovery',
        text: 'Do you have a Disaster Recovery (DR) plan in place?',
        helpText: 'Upload your DR plan and evidence of the last DR test.',
        order: 3,
    },
    {
        domain: 'RELIABILITY',
        category: 'Backup Strategy',
        text: 'Describe your backup strategy and frequency.',
        helpText: 'Upload backup policy documents or logs showing successful backups.',
        order: 4,
    },
    {
        domain: 'RELIABILITY',
        category: 'Performance Monitoring',
        text: 'How do you monitor system performance?',
        helpText: 'Upload screenshots of monitoring dashboards (e.g., Datadog, New Relic).',
        order: 5,
    },
    {
        domain: 'RELIABILITY',
        category: 'Scalability',
        text: 'Can your system scale to handle increased load?',
        helpText: 'Upload load testing reports or architecture diagrams showing auto-scaling.',
        order: 6,
    },

    // Transparency
    {
        domain: 'TRANSPARENCY',
        category: 'Data Processing',
        text: 'How do you process and store user data?',
        helpText: 'Upload your Data Processing Agreement (DPA) or Privacy Policy.',
        order: 7,
    },
    {
        domain: 'TRANSPARENCY',
        category: 'Third-Party Subprocessors',
        text: 'List all third-party subprocessors you use.',
        helpText: 'Upload a list of subprocessors or a link to your subprocessor page.',
        order: 8,
    },
    {
        domain: 'TRANSPARENCY',
        category: 'Algorithm Explainability',
        text: 'Can you explain how your core algorithms make decisions?',
        helpText: 'Upload documentation explaining your algorithmic decision-making process.',
        order: 9,
    },
    {
        domain: 'TRANSPARENCY',
        category: 'Pricing Transparency',
        text: 'Is your pricing model transparent and publicly available?',
        helpText: 'Upload your pricing sheet or a link to your public pricing page.',
        order: 10,
    },
    {
        domain: 'TRANSPARENCY',
        category: 'Change Management',
        text: 'How do you communicate product changes to customers?',
        helpText: 'Upload your changelog or release note examples.',
        order: 11,
    },
    {
        domain: 'TRANSPARENCY',
        category: 'Open Source',
        text: 'Do you contribute to or use open source software?',
        helpText: 'Upload a list of open source libraries used and any contributions made.',
        order: 12,
    },

    // Governance
    {
        domain: 'GOVERNANCE',
        category: 'Legal Compliance',
        text: 'Are you compliant with relevant laws and regulations (e.g., GDPR, CCPA)?',
        helpText: 'Upload compliance certificates or legal opinions.',
        order: 13,
    },
    {
        domain: 'GOVERNANCE',
        category: 'Information Security',
        text: 'Do you have an Information Security Policy?',
        helpText: 'Upload your Information Security Policy document.',
        order: 14,
    },
    {
        domain: 'GOVERNANCE',
        category: 'Access Control',
        text: 'How do you manage access to sensitive data?',
        helpText: 'Upload your Access Control Policy or screenshots of IAM configurations.',
        order: 15,
    },
    {
        domain: 'GOVERNANCE',
        category: 'Risk Management',
        text: 'Do you perform regular risk assessments?',
        helpText: 'Upload your latest Risk Assessment Report.',
        order: 16,
    },
    {
        domain: 'GOVERNANCE',
        category: 'Board Oversight',
        text: 'Does your board have oversight of technology and security risks?',
        helpText: 'Upload board meeting minutes (redacted) or committee charters.',
        order: 17,
    },
    {
        domain: 'GOVERNANCE',
        category: 'Ethics Policy',
        text: 'Do you have a Code of Ethics or Conduct?',
        helpText: 'Upload your Code of Ethics or Employee Handbook.',
        order: 18,
    },

    // Competence
    {
        domain: 'COMPETENCE',
        category: 'Team Expertise',
        text: 'Does your team have the necessary skills and experience?',
        helpText: 'Upload anonymized team bios or skills matrix.',
        order: 19,
    },
    {
        domain: 'COMPETENCE',
        category: 'Training',
        text: 'Do you provide regular training to your employees?',
        helpText: 'Upload training logs or certificates.',
        order: 20,
    },
    {
        domain: 'COMPETENCE',
        category: 'Quality Assurance',
        text: 'What is your QA process?',
        helpText: 'Upload your QA strategy or test plan examples.',
        order: 21,
    },
    {
        domain: 'COMPETENCE',
        category: 'Certifications',
        text: 'Do you hold any industry certifications (e.g., ISO 27001, SOC 2)?',
        helpText: 'Upload valid certificates.',
        order: 22,
    },
    {
        domain: 'COMPETENCE',
        category: 'Customer Support',
        text: 'How do you handle customer support inquiries?',
        helpText: 'Upload support SLAs or satisfaction reports.',
        order: 23,
    },
    {
        domain: 'COMPETENCE',
        category: 'Innovation',
        text: 'How do you stay current with technology trends?',
        helpText: 'Upload R&D plans or whitepapers.',
        order: 24,
    },

    // Integrity
    {
        domain: 'INTEGRITY',
        category: 'Anti-Bribery',
        text: 'Do you have an Anti-Bribery and Corruption policy?',
        helpText: 'Upload your Anti-Bribery policy.',
        order: 25,
    },
    {
        domain: 'INTEGRITY',
        category: 'Conflict of Interest',
        text: 'How do you manage conflicts of interest?',
        helpText: 'Upload your Conflict of Interest policy.',
        order: 26,
    },
    {
        domain: 'INTEGRITY',
        category: 'Whistleblowing',
        text: 'Do you have a whistleblower protection channel?',
        helpText: 'Upload your Whistleblower policy or link to reporting channel.',
        order: 27,
    },
    {
        domain: 'INTEGRITY',
        category: 'Fair Labor',
        text: 'Do you comply with fair labor standards?',
        helpText: 'Upload labor compliance statements or audit reports.',
        order: 28,
    },
    {
        domain: 'INTEGRITY',
        category: 'Environmental Impact',
        text: 'Do you track and minimize your environmental impact?',
        helpText: 'Upload your ESG report or sustainability policy.',
        order: 29,
    },
    {
        domain: 'INTEGRITY',
        category: 'Community Engagement',
        text: 'How do you engage with the community?',
        helpText: 'Upload reports on CSR initiatives.',
        order: 30,
    },
];

async function main() {
    console.log('Start seeding...');

    // Clear existing questions to avoid duplicates if re-running
    await prisma.question.deleteMany();

    for (const q of questions) {
        await prisma.question.create({
            data: {
                domain: q.domain,
                category: q.category,
                text: q.text,
                helpText: q.helpText,
                order: q.order,
            },
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
