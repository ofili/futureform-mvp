# FUTUREFORM EVIDENCE ARCHITECTURE & CREDIT SYSTEM
## Complete Integration Framework

---

## EXECUTIVE SUMMARY

FutureForm operates on a **two-layer credit model** backed by a **three-layer evidence architecture**. This creates a scalable, AI-enabled verification platform that delivers DFI-grade trust without traditional site visit costs.

**Core Innovation:** Separate human evidence collection (Respondent Credits) from machine/digital verification (Evidence Credits), while maintaining rigorous evidence standards across all layers.

---

## 1. THREE-LAYER EVIDENCE ARCHITECTURE

### Layer 1: Assessment Evidence (AE)
**Purpose:** Collect self-reported, documentation-based evidence

**Source:** Respondents during assessments

**Content Types:**
- Policy documents (PDF, Word)
- Financial statements
- Certificates and licenses
- Screenshots
- System exports
- Written statements
- Photos (non-geotagged)

**Characteristics:**
- Self-uploaded by respondents
- Manual submission
- Low verification difficulty
- Declarative (states intent/policy, not operational reality)
- Suitable for diagnostic scoring
- **Confidence Weight:** Low-to-Medium

**Use Case:** Initial trust diagnostic, gap identification, baseline establishment

---

### Layer 2: Verification Evidence (VE)
**Purpose:** Provide structured, metadata-rich, reality-confirming evidence

**Source:** 
- Company personnel
- Approved respondents
- Local-lite validators
- Field staff

**Content Types:**
- Geotagged photos
- Geotagged videos
- Time-stamped screen recordings
- Serial number scans
- Meter/dashboard walkthroughs
- On-device evidence capture

**Characteristics:**
- Structured submission requirements
- Metadata-enforced (location, time, device)
- AI-analyzed for inconsistency/fraud
- Designed for remote reality validation
- Harder to manipulate
- Provides operational truth
- **Confidence Weight:** Medium-to-High

**Use Case:** Verification workflows, Trust Score updates, remote operational validation

---

### Layer 3: Digital Signal Evidence (DSE)
**Purpose:** Provide automated, machine-generated signals to validate/contradict claims

**Source:**
- API integrations
- IoT devices and sensors
- Inverter/energy logs
- GPS tracking systems
- HR/ERP system logs
- Government databases
- Satellite imagery
- Utility data feeds
- Public registries

**Content Types:**
- JSON event logs
- API responses
- Time-series sensor data
- Encrypted device output
- Blockchain records
- Automated audit trails

**Characteristics:**
- Fully automated
- Zero human bias
- Extremely difficult to fake
- Cross-checks AE and VE
- Enables anomaly detection
- Reduces verification costs
- **Confidence Weight:** Very High

**Use Case:** Ground-truthing, automated verification, continuous monitoring, fraud detection

---

## 2. EVIDENCE METADATA SCHEMAS

### 2.1 Assessment Evidence (AE) Schema

```json
{
  "evidence_id": "string (UUID)",
  "respondent_id": "string (UUID)",
  "assessment_id": "string (UUID)",
  "uploaded_at": "timestamp (ISO 8601)",
  "file_type": "string (PDF, PNG, DOCX, etc.)",
  "file_size": "integer (bytes)",
  "file_hash": "string (SHA256)",
  "category": "enum (finance, operations, HR, compliance, safety, environmental)",
  "description": "string (optional, user-provided)",
  "ai_extracted_entities": {
    "dates": ["array of extracted dates"],
    "names": ["array of entity names"],
    "amounts": ["array of financial figures"],
    "locations": ["array of locations"],
    "key_terms": ["array of extracted keywords"]
  },
  "ai_confidence_score": "float (0-1)",
  "ai_classification": "string (document type)",
  "tags": ["array of auto-generated tags"],
  "linked_checklist_items": ["array of checklist_item_ids"],
  "processing_status": "enum (pending, processed, flagged, rejected)"
}
```

**Purpose:** Enable AI extraction, cross-referencing, and basic validation of declarative evidence

---

### 2.2 Verification Evidence (VE) Schema

```json
{
  "evidence_id": "string (UUID)",
  "respondent_id": "string (UUID)",
  "verification_id": "string (UUID)",
  "evidence_type": "enum (photo, video, screen_recording, serial_scan, walkthrough)",
  "captured_at": "timestamp (client-side)",
  "uploaded_at": "timestamp (server-side)",
  "time_delta": "integer (seconds between capture and upload)",
  "geolocation": {
    "latitude": "float",
    "longitude": "float",
    "accuracy": "float (meters)",
    "altitude": "float (optional)",
    "provider": "string (GPS, network, etc.)"
  },
  "device_id": "string (unique device identifier)",
  "device_os": "string (iOS 17.2, Android 14, etc.)",
  "device_model": "string",
  "app_version": "string",
  "file_hash": "string (SHA256)",
  "exif_data": {
    "camera_make": "string",
    "camera_model": "string",
    "original_timestamp": "timestamp",
    "gps_timestamp": "timestamp",
    "orientation": "integer",
    "software": "string"
  },
  "tamper_detection": {
    "exif_consistency": "boolean",
    "metadata_modified": "boolean",
    "file_edited": "boolean",
    "timestamp_anomaly": "boolean"
  },
  "ai_analysis": {
    "anomaly_score": "float (0-1)",
    "object_detection": ["array of detected objects"],
    "text_extraction": "string (OCR results)",
    "serial_numbers": ["array of extracted serials"],
    "consistency_flags": ["array of issues"],
    "scene_classification": "string"
  },
  "validation_status": "enum (pending, validated, flagged, rejected)",
  "checklist_item_id": "string (UUID)",
  "validator_type": "enum (operator, staff, local_lite_validator, field_agent)",
  "validation_notes": "string (optional)"
}
```

**Purpose:** Create audit-quality, tamper-evident, metadata-rich evidence for remote verification

---

### 2.3 Digital Signal Evidence (DSE) Schema

```json
{
  "ds_id": "string (UUID)",
  "source_system": "string (IoT_meter, ERP_system, GPS_tracker, gov_api, satellite, etc.)",
  "source_provider": "string (vendor/platform name)",
  "data_type": "enum (event_log, sensor_reading, transaction, gps_pulse, api_response)",
  "timestamp": "timestamp (ISO 8601)",
  "timestamp_source": "enum (device, server, external_system)",
  "device_id": "string (for IoT/sensor sources)",
  "system_id": "string (for platform integrations)",
  "raw_payload": "string (encrypted or hashed)",
  "payload_hash": "string (SHA256)",
  "parsed_data": {
    "primary_metric": "float or string",
    "unit": "string",
    "status": "string",
    "additional_fields": "object (flexible schema)"
  },
  "verification_target": "string (what claim is being verified)",
  "correlation_id": "string (links to AE/VE evidence_id)",
  "anomaly_detection": {
    "flag": "boolean",
    "anomaly_type": "enum (outlier, gap, inconsistency, impossible_value)",
    "confidence": "float (0-1)",
    "comparison_baseline": "string"
  },
  "validation_rules_applied": ["array of rule IDs"],
  "cross_check_results": {
    "ae_consistency": "boolean",
    "ve_consistency": "boolean",
    "historical_pattern": "string (consistent, anomalous, insufficient_data)"
  },
  "jurisdiction": "string (if regulatory data)",
  "data_classification": "enum (public, restricted, confidential)",
  "retention_period": "integer (days)"
}
```

**Purpose:** Enable automated verification, anomaly detection, and continuous monitoring with high-confidence machine data

---

## 3. EVIDENCE CROSS-VALIDATION FRAMEWORK

### How the Three Layers Work Together

**Trust Score Calculation:**
```
Trust Score = (
  AE_score × AE_weight × AE_confidence +
  VE_score × VE_weight × VE_confidence +
  DSE_score × DSE_weight × DSE_confidence
) / (AE_weight + VE_weight + DSE_weight)

Default Weights:
- AE_weight: 0.3
- VE_weight: 0.5
- DSE_weight: 0.8
```

**Cross-Validation Logic:**

1. **AE ↔ VE Validation**
   - Document claims vs. visual confirmation
   - Policy statements vs. operational reality
   - Example: Safety policy (AE) vs. geotagged photos of safety equipment in use (VE)

2. **VE ↔ DSE Validation**
   - Visual evidence vs. machine data
   - Operational snapshots vs. continuous logs
   - Example: Dashboard screenshot (VE) vs. actual meter API data (DSE)

3. **AE ↔ DSE Validation**
   - Declared state vs. machine-confirmed state
   - Self-reported metrics vs. system-generated logs
   - Example: Financial statement (AE) vs. transaction API data (DSE)

**Anomaly Triggers:**
- Contradiction between evidence layers
- Missing expected evidence given other layers
- Temporal inconsistencies
- Impossible or implausible values
- Statistical outliers
- Pattern breaks from historical baseline

---

## 4. TWO-LAYER CREDIT SYSTEM

### 4.1 Respondent Credits (RC)

**Definition:**  
One RC covers ALL assessment and verification activities for ONE respondent, including:
- Unlimited assessment questions
- Unlimited Assessment Evidence (AE) uploads
- Unlimited Verification Evidence (VE) submissions
- AI processing and validation
- Metadata analysis
- Anomaly detection

**Cost:** 1 RC per respondent

**What's Included:**
- Assessment questionnaire responses
- Document uploads (PDFs, images, certificates)
- Screenshots and system logs
- Geotagged photos and videos
- Screen recordings
- Serial number captures
- Any metadata processing for that respondent's evidence
- AI fraud detection and validation
- Unlimited revisions/resubmissions

**Who Consumes RC:**
- Company staff
- Operators
- Managers
- Contractors
- Supply chain vendors
- Any human respondent

**Commercial Logic:**
- No micro-charging per question or evidence item
- Predictable cost per assessment
- Encourages thorough evidence collection
- Removes friction from expanding verification scope
- Enterprise-friendly pricing model

**Example Usage:**
```
Mini-grid DFI Assessment:
- CEO: 1 RC
- CFO: 1 RC
- Operations Manager: 1 RC
- 3 Field Technicians: 3 RC
- 2 Safety Officers: 2 RC
- Supply Chain Vendor: 1 RC
Total: 9 RC consumed
```

---

### 4.2 Evidence Credits (EC)

**Definition:**  
EC covers non-respondent evidence sources, specifically:
- Digital Signal Evidence (DSE)
- Third-party evidence providers
- Automated machine evidence
- API integrations
- Local Lite Validators (LLV)
- External datasets and lookups

**Variable Cost:** Based on evidence type and volume

**What's Included:**
- API-based data pulls
- IoT sensor readings
- Energy meter logs
- GPS tracking data
- ERP/HRMS system logs
- Government database lookups
- Utility confirmations
- Satellite/environmental data
- Blockchain verification
- Local Lite Validator evidence collection
- Third-party audit reports
- All metadata processing and fraud analysis on these signals

**Who Consumes EC:**
- IoT devices and sensors
- API integrations
- Platform connectors
- Local-lite validators
- Third-party auditors
- Automated verification agents
- External data providers

**EC Pricing Structure:**

| Evidence Type | Cost per Unit | Rationale |
|--------------|---------------|-----------|
| IoT sensor reading | 0.25 EC | High volume, low processing |
| GPS daily trace | 0.5 EC | Automated, high reliability |
| Energy meter log (daily) | 0.5 EC | Structured, machine-generated |
| ERP/HRMS data pull | 1 EC | Integration overhead |
| Government API lookup | 2-3 EC | External service costs |
| Satellite image analysis | 5 EC | Expensive data source |
| Local Lite Validator (basic) | 10 EC | Human + travel time |
| Local Lite Validator (deep) | 20 EC | Extended verification |
| Third-party audit integration | 15 EC | Processing + validation |

**Commercial Logic:**
- Pay for what you use
- High-volume automated evidence is cheap
- Human-hybrid evidence (LLV) costs more but less than full site visits
- Expensive external data sources priced accordingly
- Enables continuous monitoring without breaking the bank

**Example Usage:**
```
Ongoing Monitoring Package (1 month):
- 30 daily GPS traces: 15 EC
- 500 energy meter readings: 125 EC
- 4 government registry checks: 8 EC
- 1 LLV quarterly check: 15 EC
- 60 transaction log pulls: 60 EC
Total: 223 EC consumed
```

---

## 5. COMPLETE WORKFLOW EXAMPLE

### Scenario: DFI Assessing a Mini-Grid Operator

**Phase 1: Initial Assessment (RC Heavy)**
- 12 respondents identified across operations, finance, safety
- **RC Consumed:** 12 RC
- Each respondent completes assessment and uploads AE
- System AI extracts entities, flags gaps, calculates initial Trust Score

**Phase 2: Verification (RC + EC)**
- 5 key personnel asked to submit VE (geotagged site photos, screen recordings)
- **RC Consumed:** 0 (already paid for in Phase 1)
- 2 Local Lite Validators deployed for physical verification
- **EC Consumed:** 30 EC (15 EC × 2 LLVs)

**Phase 3: Digital Signal Integration (EC Heavy)**
- IoT meter integration: 200 readings/month
- **EC Consumed:** 50 EC/month
- GPS tracking: 30 daily traces
- **EC Consumed:** 15 EC/month
- Government registry verification: 3 lookups
- **EC Consumed:** 9 EC
- ERP time log integration: 40 pulls
- **EC Consumed:** 40 EC/month

**Total Credit Consumption:**
- **Initial Assessment:** 12 RC
- **Verification Round:** 30 EC
- **Ongoing Monitoring (monthly):** 114 EC/month

**Trust Score Evolution:**
- Initial (AE only): 62/100
- Post-VE: 71/100
- Post-DSE (30 days): 78/100
- Post-DSE (90 days): 84/100

---

## 6. COMPETITIVE DIFFERENTIATION

### What This Gives FutureForm

**1. Unified Pricing Model**
- RC for human engagement
- EC for machine/digital verification
- No hidden costs, predictable scaling

**2. Scalable Verification**
- Remote-first, no expensive site visits
- AI-enabled fraud detection
- Continuous monitoring capability
- Global reach without geographic constraints

**3. DFI-Grade Credibility**
- Metadata-rich evidence
- Multi-layer cross-validation
- Audit-ready documentation
- Tamper-evident verification

**4. Predictable Margins**
- Evidence type → known cost → known margin
- Automation reduces COGS over time
- Credit model enables volume discounts
- Flexible packaging for different markets

**5. AI-Leveraged Efficiency**
- Most work automated
- Human review only on anomalies
- Pattern recognition improves with scale
- Fraud detection gets smarter over time

**6. Enterprise-Ready Model**
- Simple to explain to buyers
- Mirrors familiar SaaS pricing
- Credit wallets and top-ups
- Volume discounts and enterprise packages
- API-first for platform integrations

---

## 7. CREDIT PACKAGING & MONETIZATION

### Standard Packages

**Starter Package: $500**
- 50 RC
- 500 EC
- Use case: Single small company assessment

**Professional Package: $2,000**
- 250 RC
- 2,500 EC
- Use case: Multiple assessments or deeper verification

**Enterprise Package: $10,000**
- 1,500 RC
- 15,000 EC
- Use case: Portfolio monitoring, continuous verification

**Custom Pools**
- Volume discounts at scale
- Annual commit packages
- Dedicated support
- API rate limit increases

### Credit Pricing Economics

**RC Unit Economics:**
- Price: ~$10/RC
- COGS: ~$2/RC (platform, AI processing, storage)
- Gross Margin: ~80%

**EC Unit Economics:**
- Average Price: ~$1/EC
- COGS: $0.20-0.40/EC (varies by type)
- Gross Margin: 60-80%

**LTV/CAC Assumptions:**
- Initial assessment: 10-20 RC
- Ongoing monitoring: 100-500 EC/month
- Annual retention: 85%+
- Expansion revenue: 120%+ NRR

---

## 8. TECHNICAL IMPLEMENTATION NOTES

### Evidence Processing Pipeline

```
1. Evidence Submission
   ↓
2. Metadata Extraction & Validation
   ↓
3. AI Analysis & Classification
   ↓
4. Fraud Detection Checks
   ↓
5. Cross-Layer Validation
   ↓
6. Trust Score Update
   ↓
7. Anomaly Flagging (if applicable)
   ↓
8. Human Review Queue (for anomalies)
   ↓
9. Final Validation & Archival
```

### Key Technical Components

**Evidence Storage:**
- Encrypted at rest (AES-256)
- Immutable audit logs
- Blockchain anchoring for high-value evidence
- Geographic redundancy
- 7-year retention minimum

**AI/ML Models:**
- Document classification (AE)
- OCR and entity extraction (AE)
- Image tampering detection (VE)
- Anomaly detection (DSE)
- Cross-validation scoring
- Fraud pattern recognition

**API Architecture:**
- RESTful APIs for evidence submission
- Webhook support for real-time DSE
- GraphQL for complex queries
- Rate limiting per credit tier
- SDK support (Python, JavaScript, Java)

**Security & Compliance:**
- SOC 2 Type II certified infrastructure
- GDPR-compliant data handling
- Encryption in transit (TLS 1.3)
- Role-based access control
- Multi-factor authentication
- Audit logging for all access

---

## 9. ROADMAP TO LAUNCH

### Phase 1: Core Evidence Engine (Months 1-4)
- Build AE/VE submission interfaces
- Implement metadata schemas
- Deploy basic AI validation
- Create RC billing system

### Phase 2: Digital Signal Integration (Months 3-6)
- Build DSE connectors for top 5 integrations
- Implement EC billing
- Deploy cross-validation logic
- Launch anomaly detection

### Phase 3: Local Lite Validator Network (Months 5-8)
- Build LLV mobile app
- Create LLV marketplace
- Implement quality scoring for LLVs
- Launch pilot in 3 markets

### Phase 4: Enterprise Features (Months 7-10)
- API for platform integrations
- Custom evidence types
- Advanced fraud detection
- Portfolio dashboards

### Phase 5: Scale & Optimize (Months 9-12)
- AI model improvements
- Cost optimization
- Additional DSE integrations
- Global LLV expansion

---

## CONCLUSION

This integrated framework gives FutureForm:

✅ **A defensible technical architecture** that scales from startups to DFI portfolios  
✅ **A clear commercial model** that enterprises understand and can budget for  
✅ **Multiple layers of truth** that build credibility with rigorous buyers  
✅ **AI-first efficiency** that improves margins over time  
✅ **Remote verification** that works globally without physical infrastructure  
✅ **Competitive differentiation** that traditional auditors can't match  

The RC/EC model is simple enough for a sales pitch, sophisticated enough for institutional buyers, and flexible enough to adapt as the market evolves.

**This is your platform spec. This is your competitive moat.**