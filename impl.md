Phase 2: Question Selection & Routing (Weeks 4-5)
Goal: Intelligent question selection based on partner type and context

Deliverables:

 Question selection service
 Partner type selection in assessment wizard
 Respondent assignment logic
 Role-based question routing
 Coverage gap detection
Team: 1 Backend Engineer + 1 Frontend Engineer

Estimated Effort: 50-60 hours

Phase 3: Evidence Collection (Weeks 6-7)
Goal: Respondent portal and evidence upload

Deliverables:

 Respondent portal UI
 Evidence upload to cloud storage (S3/GCS)
 File validation and virus scanning
 Progress tracking
 Email notifications
Team: 1 Backend Engineer + 1 Frontend Engineer

Estimated Effort: 50-60 hours

Phase 4: Evidence Processing (MVP) (Weeks 8-10)
Goal: Basic evidence processing and quality scoring

Deliverables:

 Document ingestion pipeline
 Basic document classification
 Simple structured data extraction (PDFs, CSVs)
 Evidence quality scoring (completeness, recency)
 Processing status tracking
Team: 1 ML/Backend Engineer

Estimated Effort: 60-80 hours

NOTE

MVP will use rule-based extraction. Advanced ML extraction (OCR, NLP) deferred to Phase 2.

Phase 5: Scoring Engine (MVP) (Weeks 11-14)
Goal: Rule-based scoring with manual analyst input

Deliverables:

 Feature engineering pipeline (basic)
 Rule-based layer scoring
 Meta-scoring aggregation
 Red flag detection (rule-based)
 Confidence calculation
 Analyst review interface
Team: 1 ML/Backend Engineer + 1 Frontend Engineer

Estimated Effort: 80-100 hours

NOTE

MVP will use rule-based scoring algorithms based on ontology scoring logic. ML models will be trained in Phase 2 once we have training data.

Phase 6: Trust Profile Generation (Weeks 15-16)
Goal: Narrative generation and report delivery

Deliverables:

 LLM integration (OpenAI/Anthropic)
 Prompt templates for each narrative section
 Trust Profile report UI
 PDF generation
 Layer breakdown visualizations
Team: 1 Backend Engineer + 1 Frontend Engineer

Estimated Effort: 50-60 hours

Phase 7: Admin & Configuration (Weeks 17-18)
Goal: Enable non-technical users to manage ontology

Deliverables:

 Ontology editor UI (layers, questions, weights)
 Partner type configuration
 Red flag rules editor
 Sector weight configuration
 Veto criteria management
Team: 1 Frontend Engineer

Estimated Effort: 40-50 hours

Phase 8: Testing & Refinement (Weeks 19-20)
Goal: End-to-end testing and bug fixes

Deliverables:

 Unit tests for scoring algorithms
 Integration tests for assessment flow
 Sample assessment walkthroughs
 Performance optimization
 Security review
 Documentation
Team: Full team

Estimated Effort: 60-80 hours

Integration Strategy
With Existing Assessment System
The trust intelligence layer will extend the existing assessment system, not replace it:

Backward Compatibility: Existing assessments without trust intelligence continue to work
Opt-In: Trust intelligence is enabled by selecting a partner type
Gradual Migration: Existing assessment questions can be mapped to trust ontology questions
Dual Mode: Assessments can have both custom questions AND trust ontology questions
Data Migration
Existing Data:

Assessments → Add partnerTypeId (nullable)
Projects → No changes needed
Organizations → No changes needed
New Data:

Load trust ontology from JSON files
Create default partner types
Seed sector weights
Import veto criteria
API Versioning
Trust intelligence endpoints: /api/v1/trust/*
Extended assessment endpoints: /api/v1/assessments/* (backward compatible)
Respondent portal: /api/v1/respondent/* (new)
Technology Stack
Backend
Language: TypeScript (Node.js)
Framework: Next.js API routes (existing)
ORM: Prisma (existing)
Database: PostgreSQL (existing)
File Storage: AWS S3 or Vercel Blob
Queue: Vercel Cron or Inngest (for async processing)
AI/ML:
OpenAI GPT-4 (narrative generation)
Python microservice for ML scoring (Phase 2)
Frontend
Framework: Next.js 14+ (existing)
UI: Tailwind CSS + shadcn/ui (existing)
Charts: Recharts or D3.js
Forms: React Hook Form + Zod
Infrastructure
Hosting: Vercel (existing)
Database: Vercel Postgres or Supabase
File Storage: Vercel Blob or AWS S3
Monitoring: Vercel Analytics + Sentry
Success Metrics
Technical Success
 System processes 10+ concurrent assessments without performance degradation
 Evidence processing completes within 24 hours
 Trust score calculation completes within 5 minutes
 95%+ uptime for respondent portal
 API response time <500ms (p95)
Product Success
 80%+ of assessments require <2 hours analyst review
 Trust scores correlate 0.70+ with analyst judgment (validation study)
 Red flag detection achieves 90%+ precision
 Customer satisfaction 4.5/5.0+
Business Success
 Deliver 10-15 paid trust assessments in first 3 months post-launch
 40%+ of customers purchase 2nd assessment
 Reduce assessment delivery time from 3-6 months to 7-10 days
Risks & Mitigation
Risk 1: Training Data Availability
Risk: AI models require 50-75 deployment outcomes for training, which we don't have yet.

Mitigation:

Phase 1 uses rule-based scoring (no ML required)
Parallel track: Collect training data from existing knowledge and customer assessments
Phase 2 introduces ML models once data available
Risk 2: Evidence Processing Complexity
Risk: Extracting structured data from diverse document types is technically challenging.

Mitigation:

MVP focuses on simple formats (CSV, structured PDFs)
Use commercial APIs (AWS Textract, FormX.ai) for complex extraction
Analyst review catches extraction errors
Risk 3: LLM Hallucination
Risk: LLM-generated narratives may contain inaccurate or fabricated information.

Mitigation:

Strict prompt engineering with evidence grounding
Fact-checking layer (verify all claims against evidence)
Analyst review before delivery
Confidence scoring flags uncertain narratives

**Risk 4:**

Ontology Complexity
Risk: 6 layers × 12 questions × 9 partner types = complex configuration.

**Mitigation:**

Start with 2-3 partner types (Technology Vendor, Implementation Partner)
Gradual rollout of additional partner types
Admin UI makes configuration accessible to non-technical users

**Risk 5:**

Integration with Existing System
Risk: Tight coupling could break existing assessment workflows.

**Mitigation:**

Backward compatibility maintained
Feature flags for gradual rollout
Comprehensive integration testing
Parallel running of old and new systems during transition

### **Open Questions**

ML Model Hosting: Should we use a Python microservice for ML models, or can we use serverless functions (Vercel Edge Functions with ONNX)?

File Storage: AWS S3 (more control) vs. Vercel Blob (easier integration)?

Evidence Processing: Build in-house vs. use commercial APIs (AWS Textract, FormX.ai)?

LLM Provider: OpenAI GPT-4 (more capable) vs. Anthropic Claude (better for long contexts)?

Analyst Review Workflow: Should this be a separate admin interface or integrated into the main platform?

Processing status tracking
Team: 1 ML/Backend Engineer

Estimated Effort: 60-80 hours

NOTE

MVP will use rule-based extraction. Advanced ML extraction (OCR, NLP) deferred to Phase 2.

Phase 5: Scoring Engine (MVP) (Weeks 11-14)
Goal: Rule-based scoring with manual analyst input

Deliverables:

 Feature engineering pipeline (basic)
 Rule-based layer scoring
 Meta-scoring aggregation
 Red flag detection (rule-based)
 Confidence calculation
 Analyst review interface
Team: 1 ML/Backend Engineer + 1 Frontend Engineer

Estimated Effort: 80-100 hours

NOTE

MVP will use rule-based scoring algorithms based on ontology scoring logic. ML models will be trained in Phase 2 once we have training data.

Phase 6: Trust Profile Generation (Weeks 15-16)
Goal: Narrative generation and report delivery

Deliverables:

 LLM integration (OpenAI/Anthropic)
 Prompt templates for each narrative section
 Trust Profile report UI
 PDF generation
 Layer breakdown visualizations
Team: 1 Backend Engineer + 1 Frontend Engineer

Estimated Effort: 50-60 hours

Phase 7: Admin & Configuration (Weeks 17-18)
Goal: Enable non-technical users to manage ontology

Deliverables:

 Ontology editor UI (layers, questions, weights)
 Partner type configuration
 Red flag rules editor
 Sector weight configuration
 Veto criteria management
Team: 1 Frontend Engineer

Estimated Effort: 40-50 hours

Phase 8: Testing & Refinement (Weeks 19-20)
Goal: End-to-end testing and bug fixes

Deliverables:

 Unit tests for scoring algorithms
 Integration tests for assessment flow
 Sample assessment walkthroughs
 Performance optimization
 Security review
 Documentation
Team: Full team

Estimated Effort: 60-80 hours

Integration Strategy
With Existing Assessment System
The trust intelligence layer will extend the existing assessment system, not replace it:

Backward Compatibility: Existing assessments without trust intelligence continue to work
Opt-In: Trust intelligence is enabled by selecting a partner type
Gradual Migration: Existing assessment questions can be mapped to trust ontology questions
Dual Mode: Assessments can have both custom questions AND trust ontology questions
Data Migration
Existing Data:

Assessments → Add partnerTypeId (nullable)
Projects → No changes needed
Organizations → No changes needed
New Data:

Load trust ontology from JSON files
Create default partner types
Seed sector weights
Import veto criteria
API Versioning
Trust intelligence endpoints: /api/v1/trust/*
Extended assessment endpoints: /api/v1/assessments/* (backward compatible)
Respondent portal: /api/v1/respondent/* (new)
Technology Stack
Backend
Language: TypeScript (Node.js)
Framework: Next.js API routes (existing)
ORM: Prisma (existing)
Database: PostgreSQL (existing)
File Storage: AWS S3 or Vercel Blob
Queue: Vercel Cron or Inngest (for async processing)
AI/ML:
OpenAI GPT-4 (narrative generation)
Python microservice for ML scoring (Phase 2)
Frontend
Framework: Next.js 14+ (existing)
UI: Tailwind CSS + shadcn/ui (existing)
Charts: Recharts or D3.js
Forms: React Hook Form + Zod
Infrastructure
Hosting: Vercel (existing)
Database: Vercel Postgres or Supabase
File Storage: Vercel Blob or AWS S3
Monitoring: Vercel Analytics + Sentry
Success Metrics
Technical Success
 System processes 10+ concurrent assessments without performance degradation
 Evidence processing completes within 24 hours
 Trust score calculation completes within 5 minutes
 95%+ uptime for respondent portal
 API response time <500ms (p95)
Product Success
 80%+ of assessments require <2 hours analyst review
 Trust scores correlate 0.70+ with analyst judgment (validation study)
 Red flag detection achieves 90%+ precision
 Customer satisfaction 4.5/5.0+
Business Success
 Deliver 10-15 paid trust assessments in first 3 months post-launch
 40%+ of customers purchase 2nd assessment
 Reduce assessment delivery time from 3-6 months to 7-10 days
Risks & Mitigation
Risk 1: Training Data Availability
Risk: AI models require 50-75 deployment outcomes for training, which we don't have yet.

Mitigation:

Phase 1 uses rule-based scoring (no ML required)
Parallel track: Collect training data from existing knowledge and customer assessments
Phase 2 introduces ML models once data available
Risk 2: Evidence Processing Complexity
Risk: Extracting structured data from diverse document types is technically challenging.

Mitigation:

MVP focuses on simple formats (CSV, structured PDFs)
Use commercial APIs (AWS Textract, FormX.ai) for complex extraction
Analyst review catches extraction errors
Risk 3: LLM Hallucination
Risk: LLM-generated narratives may contain inaccurate or fabricated information.

Mitigation:

Strict prompt engineering with evidence grounding
Fact-checking layer (verify all claims against evidence)
Analyst review before delivery
Confidence scoring flags uncertain narratives

**Risk 4:**

Ontology Complexity
Risk: 6 layers × 12 questions × 9 partner types = complex configuration.

**Mitigation:**

Start with 2-3 partner types (Technology Vendor, Implementation Partner)
Gradual rollout of additional partner types
Admin UI makes configuration accessible to non-technical users

**Risk 5:**

Integration with Existing System
Risk: Tight coupling could break existing assessment workflows.

**Mitigation:**

Backward compatibility maintained
Feature flags for gradual rollout
Comprehensive integration testing
Parallel running of old and new systems during transition

### **Open Questions - RESOLVED**

**ML Model Hosting:** Should we use a Python microservice for ML models, or can we use serverless functions (Vercel Edge Functions with ONNX)?

- ✅ **Decision:** Use Python microservice. Create a separate folder in the workspace for this.

**File Storage:** AWS S3 (more control) vs. Vercel Blob (easier integration)?

- ✅ **Decision:** Vercel Blob (easier integration with existing Vercel infrastructure).

**Evidence Processing:** Build in-house vs. use commercial APIs (AWS Textract, FormX.ai)?

- ✅ **Decision:** Use commercial API. Choose the most budget-friendly and effective API.

**LLM Provider:** OpenAI GPT-4 (more capable) vs. Anthropic Claude (better for long contexts)?

- ✅ **Decision:**
  - OpenAI GPT-4 for scoring
  - Claude for report generation
  - User will provide prompts

**Analyst Review Workflow:** Should this be a separate admin interface or integrated into the main platform?

- ✅ **Decision:** Separate admin interface.

**Benchmarking Data:** How do we collect sector/geography benchmarks without violating customer confidentiality?

- ✅ **Decision:** Use aggregates without mentioning any particular customer.

**Pricing Model:** How should trust intelligence assessments be priced relative to standard assessments?

- ⏳ **Status:** Undecided (to be determined later).

---

## **Current Status (Phase 3 Complete)**

### ✅ **Completed Phases:**

**Phase 1:** Database Foundation

- 14 trust intelligence models created
- Schema migrated successfully
- 6 layers, 28 sub-dimensions, 83 questions seeded

**Phase 2:** Trust Ontology Service Layer

- `TrustOntologyService` with 13 query methods
- 7 REST API endpoints (`/api/v1/trust/*`)
- Admin UI for viewing ontology data

**Phase 3:** Assessment Integration

- `TrustPartnerTypeSelector` component
- Partner type selection in assessment wizard
- Role mapping using `TrustRequiredRole`s
- Backend question filtering by partner type

### 🎯 **Next Phase: Evidence Collection (Phase 4)**

**Goal:** Build respondent portal and evidence upload system

**Key Deliverables:**

1. Respondent portal UI (token-based access)
2. Evidence upload to Vercel Blob
3. File validation and virus scanning
4. Progress tracking
5. Email notifications

**Estimated Effort:** 50-60 hours
**Team:** 1 Backend Engineer + 1 Frontend Engineer
