# Trust Intelligence Layer - Database Schema

## Overview

The Trust Intelligence Layer adds AI-powered partnership risk assessment capabilities to FutureForm. This implementation includes:

- **14 new database models** for trust ontology, scoring, and evidence management
- **6 trust layers** (Reliability, Transparency, Governance, Competence, Integrity, Ecosystem)
- **72 questions** across all layers (12 per layer)
- **Partner type-based question routing** for intelligent assessments
- **Evidence processing pipeline** for document analysis
- **AI scoring engine** with confidence intervals and red flag detection

## Database Models

### Core Ontology

- `TrustLayer` - 6 trust layers (L1-L6)
- `TrustSubDimension` - Sub-dimensions within each layer
- `TrustQuestion` - Individual assessment questions
- `TrustPartnerType` - Partner type definitions (Technology Vendor, Implementation Partner, etc.)
- `TrustRequiredRole` - Required roles for each partner type
- `TrustPartnerTypeQuestion` - Question-to-partner-type mapping

### Assessment Execution

- `TrustRespondent` - Respondents invited to complete assessments
- `TrustQuestionResponse` - Responses to trust questions
- `TrustEvidenceFile` - Uploaded evidence documents

### Scoring & Results

- `TrustLayerScore` - Scores for each layer (1.0-5.0)
- `TrustScore` - Overall trust score with recommendations
- `TrustRedFlag` - Critical risk flags detected

### Configuration

- `TrustSectorWeight` - Sector-specific layer weights
- `TrustVetoCriterion` - Veto rules that override scores

## Migration Steps

### 1. Validate Schema

```bash
npx prisma validate
```

### 2. Create Migration (Create-Only Mode)

```bash
npx prisma migrate dev --name add_trust_intelligence_layer --create-only
```

### 3. Review Migration File

Check `prisma/migrations/[timestamp]_add_trust_intelligence_layer/migration.sql`

### 4. Apply Migration

```bash
npx prisma migrate deploy
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Seed Ontology Data

```bash
npx ts-node prisma/seed-trust-ontology.ts
```

## Data Sources

The seed script loads data from:

- `Product/ontology_data/layers_L1_Reliability.json`
- `Product/ontology_data/layers_L2_Transparency.json`
- `Product/ontology_data/layers_L3_Governance.json`
- `Product/ontology_data/layers_L4_Competence.json`
- `Product/ontology_data/layers_L5_Integrity.json`
- `Product/ontology_data/layers_L6_Ecosystem.json`
- `Product/ontology_data/master_layer_weights.json`
- `Product/ontology_data/sector_weights/*.json`
- `Product/ontology_data/master_veto_criteria.json`

## Assessment Model Extensions

The existing `Assessment` model has been extended with:

```prisma
model Assessment {
  // ... existing fields ...
  
  // Trust Intelligence relations
  trustPartnerTypeId    String?
  trustPartnerType      TrustPartnerType?
  trustDeploymentContext Json?
  trustRespondents      TrustRespondent[]
  trustResponses        TrustQuestionResponse[]
  trustEvidenceFiles    TrustEvidenceFile[]
  trustLayerScores      TrustLayerScore[]
  trustScore            TrustScore?
  trustRedFlags         TrustRedFlag[]
}
```

## Usage Example

```typescript
// Create trust assessment
const assessment = await prisma.assessment.create({
  data: {
    projectId: projectId,
    trustPartnerTypeId: partnerTypeId,
    trustDeploymentContext: {
      sector: 'energy',
      geography: 'East Africa',
      stage: 'growth'
    }
  }
});

// Add respondents
const respondent = await prisma.trustRespondent.create({
  data: {
    assessmentId: assessment.id,
    name: 'John Doe',
    email: 'john@partner.com',
    roleId: ctoRoleId,
    accessToken: generateToken()
  }
});

// Calculate scores
const layerScore = await prisma.trustLayerScore.create({
  data: {
    assessmentId: assessment.id,
    layerId: 'L1',
    score: 4.2,
    confidence: 0.85,
    evidenceQuality: 4.0,
    subDimensionScores: { /* ... */ }
  }
});
```

## Next Steps

1. ✅ Schema designed and validated
2. ⏳ Migration created (pending application)
3. ⏳ Seed data loading
4. 🔜 API service layer implementation
5. 🔜 Frontend components
6. 🔜 AI scoring engine

## Troubleshooting

If migration fails:

1. Check database connection in `.env`
2. Ensure no schema conflicts with existing tables
3. Review migration SQL for any issues
4. Try `npx prisma migrate reset` (WARNING: deletes all data)
5. Contact dev team if issues persist
