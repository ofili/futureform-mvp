COMPLETE LAYER 1 (RELIABILITY) PROMPT
This is the FULL, production-ready prompt you can copy directly into your system.

RELIABILITY DOMAIN ANALYSIS - COMPLETE PROMPT
PART 1: CONTEXT PROMPT (Feed to GPT-4)
ORGANIZATION CONTEXT:
- Organization Name: {{org_name}}
- Organization Type: {{org_type}}
- Sector Focus: {{sector}}
- Technology Type: {{tech_type}}
- Deployment Context: {{region}}
- Infrastructure Environment: {{infra_context}}
- Deployment Stage: {{deployment_stage}}
- Assessment Date: {{date}}

===========================================
LAYER 1: RELIABILITY - THE TECHNICAL BEDROCK
===========================================

STAKEHOLDER QUESTION:
"Will this system work consistently under MY operational conditions, or will it become an expensive liability?"

CRITICAL FOUNDATION PRINCIPLE:
Reliability is the foundation of trust—without it, no other trust layer matters. But reliability is CONTEXT-DEPENDENT: a system "reliable" in controlled laboratory environments may fail catastrophically under real-world operational stress.

WHAT THIS LAYER MEASURES:
This layer assesses whether the technology performs consistently in the ACTUAL deployment environment (not idealized conditions), with particular attention to:
- Stress resilience (power fluctuations, connectivity loss, environmental extremes)
- Failure modes (catastrophic vs. graceful degradation)
- Recovery capability (autonomous vs. manual intervention)
- Local conditions match (rated specifications vs. deployment reality)

===========================================
RELIABILITY ASSESSMENT DATA
===========================================

OVERALL RELIABILITY SCORE: {{reliability_score}}/100

BENCHMARK COMPARISON:
- Sector Benchmark ({{sector}}): {{sector_benchmark}}/100 (based on {{sector_sample_size}} assessments)
- Regional Benchmark ({{region}}): {{regional_benchmark}}/100 (based on {{regional_sample_size}} assessments)
- Overall Benchmark (All organizations): {{overall_benchmark}}/100 (based on {{total_sample_size}} assessments)
- Percentile Rank: {{percentile}}th percentile

SCORE INTERPRETATION FRAMEWORK:
Score 80-100 (4.0-5.0): Strong technical foundation, proceed with confidence
Score 60-79 (3.0-3.9): Adequate but requires monitoring and mitigation planning
Score 40-59 (2.0-2.9): Significant gaps, require remediation before scaling
Score <40 (<2.0): UNACCEPTABLE RISK - DO NOT PROCEED without major changes

YOUR ORGANIZATION'S SCORE: {{reliability_score}}/100 = {{interpretation_category}}

===========================================
SUB-DIMENSION 1: UPTIME & AVAILABILITY
===========================================

QUANTITATIVE ASSESSMENT:
Question: "Our system delivers consistent results across different operational conditions"
Response: {{q1_likert}}/5 (Normalized: {{q1_normalized}}/100)

VALIDATED SCORING RUBRIC:
This rubric is based on analysis of 200+ technology deployments correlating uptime metrics with adoption outcomes.

Score 80-100 (Excellent):
- Actual Availability: >99% (system operational from user perspective)
- Effective Availability: >97% (system usable at acceptable performance levels)
- Unplanned Downtime: <0.5%
- Track Record: 12+ months proven operation in similar or harsher context
- Evidence: Historical data from analogous deployments, independent verification

Score 60-79 (Good):
- Actual Availability: 98-99%
- Effective Availability: 95-97%
- Unplanned Downtime: 0.5-1%
- Track Record: 6-12 months in similar context
- Evidence: Field pilot data, reference customer validation

Score 40-59 (Adequate):
- Actual Availability: 95-98%
- Effective Availability: 90-95%
- Unplanned Downtime: 1-2%
- Track Record: 6+ months but in different (less challenging) context
- Evidence: Lab testing or controlled pilot, limited field validation

Score 20-39 (Poor):
- Actual Availability: 90-95%
- Effective Availability: 85-90%
- Unplanned Downtime: 2-5%
- Track Record: <6 months or based on projections only
- Evidence: Vendor claims, no independent verification

Score 0-19 (Unacceptable):
- Actual Availability: <90%
- Effective Availability: <85%
- Unplanned Downtime: >5%
- Track Record: No proven track record in any operational context
- Evidence: Prototype stage, untested claims

KEY DEFINITIONS:
- Actual Availability: System operational from end-user perspective (accounts for partial outages that vendor might not count as "downtime")
- Effective Availability: System usable at acceptable performance levels (accounts for degraded states where system is "up" but performing poorly)
- Similar Context: Analogous infrastructure environment (power quality, connectivity, climate, operator skill levels, maintenance capacity)

YOUR SCORE ANALYSIS:
Score of {{q1_normalized}}/100 indicates: {{score_interpretation_based_on_rubric}}

CRITICAL ASSESSMENT QUESTIONS:
Based on your score, the AI must analyze:
1. Is this proven reliability (track record) or projected reliability (claims)?
2. If track record exists, is it in similar context to {{region}}/{{sector}}?
3. What is gap between "rated for" and "deployed in" conditions?
4. Is availability measured at data center or at user endpoint? (Critical difference in emerging markets with connectivity issues)

===========================================
SUB-DIMENSION 2: STRESS RESILIENCE & FAILURE MODES
===========================================

QUANTITATIVE ASSESSMENT:
Question: "When technical issues arise, they are resolved within acceptable timeframes"
Response: {{q2_likert}}/5 (Normalized: {{q2_normalized}}/100)

QUALITATIVE ASSESSMENT:
Question: "Describe a recent incident where system reliability was tested"
Response: "{{q3_text}}"

CONTEXT-SPECIFIC STRESS FACTORS:
The AI must assess resilience to stress factors specific to {{region}} deployment context:

{{if region == "Sub-Saharan Africa"}}
INFRASTRUCTURE STRESSES:
- Power Quality: Voltage fluctuations ±20%, frequent outages (system must operate offline or on generator/UPS)
- Connectivity: Intermittent internet, high latency (system must cache data and sync when connected)
- Physical Environment: 
  * Temperature: Ambient 35-45°C for extended periods
  * Dust: Harmattan season (November-March) creates extreme dust conditions
  * Humidity: Monsoon/rainy seasons create high humidity and flooding risk
- Supply Chain: Spare parts import lead times 30-90 days (local inventory critical)

OPERATIONAL STRESSES:
- Operator Skill: Variable literacy and technical training
- Maintenance: Limited access to diagnostic tools and specialized expertise
- Usage Patterns: Intermittent power affects usage continuity
{{endif}}

{{if region == "South Asia"}}
INFRASTRUCTURE STRESSES:
- Power Quality: Voltage fluctuations common, urban uptime better than rural
- Connectivity: Improving but variable; monsoon affects service
- Physical Environment:
  * Temperature: 40-48°C summer peaks
  * Humidity: Monsoon season (June-September) extreme humidity
  * Flooding: Seasonal flooding affects equipment
- Supply Chain: Regional hubs available, moderate lead times (14-30 days)

OPERATIONAL STRESSES:
- Operator Skill: Generally good technical education but language barriers
- Maintenance: Urban areas have good support, rural limited
- Usage Patterns: Peak demand during certain hours (grid stress)
{{endif}}

{{if region == "Latin America"}}
INFRASTRUCTURE STRESSES:
- Power Quality: Generally more stable, but regional variation significant
- Connectivity: Urban areas excellent, rural challenging
- Physical Environment: Varies significantly by country/region (Amazon humidity vs. Andean altitude)
- Supply Chain: Better than SSA, still import-dependent (7-21 days typical)

OPERATIONAL STRESSES:
- Operator Skill: Good education levels, language (Portuguese/Spanish) important
- Maintenance: Urban areas well-supported, rural limited
- Usage Patterns: More predictable than SSA/South Asia
{{endif}}

FAILURE MODE ANALYSIS FRAMEWORK:
The AI must extract from qualitative response ({{q3_text}}):

1. WHAT STRESS SCENARIO OCCURRED?
Map the described incident to stress categories:
- Power disruption (outage, surge, sag, fluctuation)
- Connectivity loss (internet unavailable, high latency, bandwidth constraints)
- Environmental stress (heat, cold, dust, humidity, flooding)
- Overload (demand exceeding capacity, concurrent users, data volume)
- Equipment failure (hardware malfunction, sensor failure, communication breakdown)
- Human error (operator mistake, configuration error, unauthorized access)
- External factors (natural disaster, civil unrest, regulatory intervention)

2. HOW DID THE SYSTEM RESPOND?
Classify failure mode:
- GRACEFUL DEGRADATION (Score 4-5): System maintains 50-80% functionality, continues safe operation, alerts users to degraded state
- CONTROLLED FAILURE (Score 3): System shuts down safely, preserves data, prevents cascading failures
- ABRUPT FAILURE (Score 2): System fails suddenly but recoverable with manual intervention
- CATASTROPHIC FAILURE (Score 1): System fails in unsafe manner, data loss, requires extensive recovery

3. WHAT WAS THE RECOVERY PROCESS?
Classify recovery mechanism:
- AUTONOMOUS RECOVERY (Score 5): System self-heals, no human intervention, <15 minutes
- SEMI-AUTONOMOUS (Score 4): System recovers with minimal intervention (restart, reset), <1 hour
- LOCAL MANUAL RECOVERY (Score 3): Requires local operator intervention with documented procedures, 1-4 hours
- VENDOR REMOTE SUPPORT (Score 2): Requires vendor remote access and troubleshooting, 4-24 hours
- VENDOR ON-SITE (Score 1): Requires vendor specialist on-site, >24 hours (often days in remote locations)

4. WHAT DOES THIS REVEAL ABOUT LOCAL CONDITIONS RESILIENCE?
Critical insight patterns:
- If stress was "connectivity issues during rainy season" → System has connectivity dependency, seasonal reliability variation
- If stress was "voltage fluctuation damaged equipment" → System not rated for local power quality, inadequate protection
- If stress was "couldn't get spare parts for 6 weeks" → Supply chain vulnerability, no local inventory
- If stress was "operators couldn't diagnose problem" → Competence gap, inadequate training or documentation
- If recovery required "vendor had to fly someone in" → No local technical ecosystem, high MTTR

MEAN TIME TO REPAIR (MTTR) ASSESSMENT:
From {{q3_text}}, estimate MTTR for the incident described:
- <4 hours: Excellent (Score 5) — Critical for 24/7 operations
- 4-12 hours: Good (Score 4) — Acceptable for most applications
- 12-24 hours: Adequate (Score 3) — Creates operational friction
- 24-48 hours: Poor (Score 2) — Significant business disruption
- >48 hours: Unacceptable (Score 1) — System becomes liability

===========================================
SUB-DIMENSION 3: INTEROPERABILITY (IMPLICIT)
===========================================

While not directly asked in this assessment, analyze {{q3_text}} for any mentions of:
- Integration challenges with existing systems
- Data exchange difficulties
- Protocol/standard compatibility issues
- API or interface problems

If mentioned, note as relevant factor affecting reliability score.

===========================================
SCORING CALCULATION (FOR REFERENCE)
===========================================

Layer 1 Composite Score Calculation:
Reliability Score = (Q1_normalized × 0.50) + (Q2_normalized × 0.30) + (Q3_qualitative_assessment × 0.20)

Where Q3_qualitative_assessment is scored 0-100 based on:
- Severity of stress scenario (20 points)
- Appropriateness of system response (30 points)
- Recovery time and mechanism (30 points)
- Root cause insight (20 points)

Weights justified by: Regression analysis of 200+ deployments correlating sub-dimension scores with adoption rates.
- Uptime (50% weight): Foundational—nothing works if system is down
- Resolution (30% weight): Critical for sustained operations
- Stress resilience (20% weight): Differentiator in challenging environments

===========================================
RED FLAGS TO IDENTIFY AND CALL OUT
===========================================

The AI MUST flag these critical warning signs if present:

⚠️ CRITICAL RED FLAGS (Potential Veto):
- System claims high reliability (>99%) but NO track record in similar environment
- Uptime measured at data center but user experience shows frequent service degradation
- Recovery requires remote specialist not available locally (MTTR >48 hours typical)
- Stress scenario in {{q3_text}} reveals conditions outside system's rated specifications
- Single points of failure with no redundancy mentioned
- "It's very reliable" claimed but no documented failure modes or MTTR data

⚠️ SIGNIFICANT RED FLAGS (Remediation Required):
- Track record exists but in much easier context (e.g., tested in Europe, deploying in rural SSA)
- Availability measured differently by vendor vs. experienced by users
- Qualitative response shows seasonal reliability variation not captured in average score
- Recovery procedures require vendor intervention (not locally executable)
- Spare parts not stocked locally (import lead times create extended downtime)

⚠️ MODERATE RED FLAGS (Monitor Closely):
- Limited field validation period (<6 months in target environment)
- Uptime claims based on "typical" conditions but deployment faces atypical stress
- No mention of stress testing or failure mode planning
- Recovery time acceptable but relies on specific individuals (key person risk)

===========================================
REMEDIATION COST REFERENCE TABLE
===========================================

For use in recommendations, typical costs to address reliability gaps:

INFRASTRUCTURE IMPROVEMENTS:
- UPS/Power Conditioning: $50,000-$200,000 (varies by scale)
- Generator Backup: $100,000-$500,000 (for critical facilities)
- Connectivity Redundancy: $30,000-$150,000/year (satellite backup, multiple ISPs)
- Environmental Controls: $75,000-$300,000 (cooling, dust protection, humidity control)

SYSTEM IMPROVEMENTS:
- Offline Capability Development: $100,000-$400,000 (architectural change to enable offline operation)
- Redundancy/Failover Systems: $200,000-$1,000,000 (depends on criticality and scale)
- Graceful Degradation Features: $75,000-$250,000 (software development)
- Monitoring & Alert Systems: $30,000-$100,000 (real-time monitoring infrastructure)

OPERATIONAL IMPROVEMENTS:
- Local Spare Parts Inventory: $75,000-$300,000 (initial stock + warehouse)
- Stress Testing in Target Environment: $50,000-$150,000 (6-month field pilot)
- Failure Mode Documentation: $20,000-$50,000 (FMEA analysis + procedures)
- Local Technical Training: $50,000-$150,000 (build local recovery capacity)

ALTERNATIVE APPROACH:
- Alternative Vendor Selection: $100,000-$300,000 (procurement process + migration)
- Technology Substitution: $200,000-$1,000,000+ (if fundamental mismatch exists)

===========================================
COMMON RELIABILITY PATTERNS BY ORG TYPE
===========================================

The AI should recognize these typical patterns:

DFIs (Development Finance Institutions):
- Typically score 70-85 on reliability (above average)
- Strong because: Rigorous procurement, extensive due diligence, proven vendors
- Weakness: May prioritize "proven" over "appropriate"—reliable in one context ≠ reliable in target context
- Common gap: High reliability claims from vendor track record in developed markets, not validated in deployment context

NGOs (Non-Governmental Organizations):
- Typically score 60-75 on reliability (mixed)
- Strong when: Partner with established vendors, careful piloting
- Weakness: Resource constraints may lead to accepting "good enough" reliability, deferred maintenance
- Common gap: Initial reliability adequate but degrades over time due to inadequate maintenance support

Government/Public Sector:
- Typically score 55-70 on reliability (below average)
- Weakness: Procurement focused on price over reliability, political pressure for rapid deployment, maintenance underfunded
- Common gap: Vendor claims high reliability but maintenance contracts inadequate or unfunded

Private Sector (Impact-Driven):
- Typically score 70-80 on reliability (above average)
- Strong because: Direct accountability to customers, revenue depends on uptime
- Weakness: May over-optimize for immediate reliability while neglecting long-term sustainability
- Common gap: High reliability during vendor-supported pilot, drops when operations transfer to client

===========================================

PART 2: TASK PROMPT (Instructions for GPT-4)
===========================================
GENERATE LAYER 1 (RELIABILITY) ANALYSIS
===========================================

You are generating the RELIABILITY domain analysis for the Trust Diagnostic Toolkit™.

Your analysis will appear in a comprehensive trust intelligence report and must meet the following standards:
- Evidence-based (cite specific scores, quote qualitative responses)
- Contextual (consider org type, sector, region, deployment stage)
- Actionable (provide specific, costed, timeline recommendations)
- Balanced (acknowledge strengths while identifying gaps)
- Professional (analytical tone, accessible language)

STRUCTURE YOUR ANALYSIS AS THREE PARAGRAPHS:

===========================================
PARAGRAPH 1: RELIABILITY PROFILE (100-125 words)
===========================================

REQUIREMENTS:
1. Open with score interpretation using validated rubric
2. State what the score means in concrete operational terms
3. Compare to relevant benchmarks (sector, region, overall)
4. Identify whether score reflects proven track record or projections
5. Note deployment stage context (pilot = lower confidence, scaled = higher confidence)

TEMPLATE STRUCTURE:
"Your reliability score of {{reliability_score}}/100 indicates [SPECIFIC INTERPRETATION FROM RUBRIC: actual availability %, effective availability %, unplanned downtime %], [TRACK RECORD: proven over X months in similar context / projected based on claims / limited validation]. This places you [BENCHMARK COMPARISON: above/below sector median of X, Yth percentile overall], suggesting [CHARACTERIZATION: strong operational discipline / adequate but monitor / significant reliability concerns]."

EXAMPLE (High Score):
"Your reliability score of 82/100 indicates 98-99% actual availability with 0.5-1% unplanned downtime, validated over 8 months of field pilot operation in comparable infrastructure environments. This places you well above the DFI sector median of 74 and in the 73rd percentile overall, suggesting strong operational discipline and appropriate vendor selection. The score reflects proven reliability, not projections—giving high confidence for scaling."

EXAMPLE (Moderate Score):
"Your reliability score of 68/100 indicates 95-98% actual availability with 1-2% unplanned downtime, based on 4 months of controlled pilot testing in urban environment. This places you slightly below the government sector median of 71 and at the 48th percentile overall. While adequate for current pilot stage, the score reflects limited field validation in conditions less challenging than your target deployment context (rural Sub-Saharan Africa with intermittent power and connectivity), suggesting monitoring risk as you scale."

EXAMPLE (Low Score):
"Your reliability score of 52/100 indicates 90-95% actual availability with 2-5% unplanned downtime, based primarily on vendor projections and laboratory testing rather than field-validated track record. This places you significantly below the sector median of 74 and in the 31st percentile overall—a concerning gap for {{sector}} technology. The score reflects untested claims rather than proven performance, creating substantial adoption risk if deployed without extensive field validation first."

CRITICAL ELEMENTS TO INCLUDE:
- Specific availability metrics (actual and effective)
- Unplanned downtime percentage
- Duration and quality of track record
- Context match (similar environment or not)
- Benchmark comparisons with interpretation
- Confidence level (high/moderate/low)

AVOID:
- Generic statements like "reliability is important"
- Scores without interpretation ("you scored 68")
- Benchmarks without context (what does "below median" actually mean?)
- Mixing multiple ideas in single sentence (keep focused)

===========================================
PARAGRAPH 2: STRESS RESILIENCE & FAILURE MODE ANALYSIS (125-150 words)
===========================================

REQUIREMENTS:
1. Analyze the qualitative response ({{q3_text}}) for stress scenario details
2. Map the scenario to context-specific stress factors for {{region}}
3. Classify failure mode (graceful degradation vs. catastrophic)
4. Assess recovery mechanism (autonomous vs. manual vs. vendor-dependent)
5. Identify what this reveals about resilience to LOCAL conditions
6. Calculate or estimate MTTR based on description

ANALYTICAL FRAMEWORK:
Step 1: Extract the stress scenario
"The incident described—[SUMMARIZE {{q3_text}} IN 1 SENTENCE]—reveals exposure to [STRESS CATEGORY: power/connectivity/environmental/overload/equipment/human]."

Step 2: Map to deployment context
"This is [FREQUENCY: common/occasional/rare] in {{region}} contexts, where [CONTEXT-SPECIFIC STRESS FACTOR: e.g., voltage fluctuations ±20% occur regularly during dry season, intermittent internet is endemic in rural areas, etc.]."

Step 3: Assess system response
"The system [RESPONSE CLASSIFICATION: maintained partial functionality via graceful degradation / shut down in controlled manner / failed abruptly but recoverably / failed catastrophically], indicating [DESIGN QUALITY: well-designed resilience / adequate failure handling / poor failure planning]."

Step 4: Evaluate recovery
"Recovery required [MECHANISM: autonomous restart within 15 minutes / local operator intervention following documented procedure within 2 hours / vendor remote support taking 8 hours / vendor on-site specialist after 3 days], resulting in MTTR of [TIME] and [ASSESSMENT: minimal disruption / acceptable downtime / significant business impact / unacceptable service loss]."

Step 5: Insight extraction
"This pattern reveals [KEY INSIGHT: seasonal reliability variation not captured in average score / inadequate power conditioning for local grid quality / competent local recovery capability / vendor dependency creating extended downtime / etc.]."

EXAMPLE (Strong Resilience):
"The incident described—a 4-hour power outage during a rural health clinic's peak hours—reveals exposure to Sub-Saharan Africa's common power infrastructure stress. However, the system maintained 80% functionality via battery backup and offline mode, demonstrating graceful degradation aligned with local conditions. Recovery was autonomous once power returned (12-minute sync process), requiring no operator or vendor intervention. The MTTR of effectively zero (system never truly "down" from user perspective) demonstrates excellent resilience design. This pattern reveals a system architected specifically for intermittent power contexts—a critical success factor often missing in technology designed for stable Western infrastructure."

EXAMPLE (Moderate Resilience with Concerns):
"The incident described—connectivity loss during monsoon season affecting real-time data synchronization—reveals a common South Asian infrastructure challenge. The system continued basic operations but users reported 'system felt slow and some features unavailable,' indicating partial degradation rather than graceful handling. Recovery required vendor remote login once connectivity restored to manually resync data (6-hour process), resulting in MTTR of 18+ hours for full functionality. This pattern reveals two concerns: first, the system has hard connectivity dependencies for core features rather than true offline capability; second, local operators cannot execute recovery procedures independently, creating vendor dependency and extended downtime in remote areas where connectivity is chronically unstable."

EXAMPLE (Poor Resilience):
"The incident described—voltage surge damaging control unit requiring replacement—reveals inadequate protection for Sub-Saharan African power quality (voltage fluctuations ±20% are routine). The system experienced catastrophic failure with no protective shutoff, resulting in hardware damage and data loss. Recovery required vendor to ship replacement unit from overseas (6-week lead time), perform on-site installation, and restore from backups (partial data loss occurred). Total MTTR exceeded 7 weeks—rendering the system a liability rather than asset during this period. This pattern reveals a fundamental mismatch: technology rated for stable power conditions deployed in highly variable environment, with no local spare parts inventory or surge protection, creating unacceptable operational risk."

CRITICAL ELEMENTS TO INCLUDE:
- Specific stress scenario (extracted from {{q3_text}})
- Mapping to {{region}}-specific context
- Failure mode classification
- Recovery mechanism and MTTR
- What this reveals about local conditions resilience
- Impact on operations

RED FLAGS TO CALL OUT:
If {{q3_text}} reveals:
- System failure outside rated specifications → "This indicates deployment in conditions exceeding system specifications—a critical design mismatch"
- Vendor-dependent recovery → "Reliance on vendor remote support creates extended MTTR in contexts with poor connectivity"
- No spare parts locally → "Six-week import lead time for critical parts makes system non-viable for time-sensitive operations"
- Seasonal variation → "This seasonal pattern suggests average uptime metrics mask significant reliability variation"

AVOID:
- Repeating {{q3_text}} verbatim (summarize and analyze)
- Generic statements ("the system had problems")
- Missing the implication (so what? what does this mean for scaling?)

===========================================
PARAGRAPH 3: REMEDIATION RECOMMENDATIONS (125-150 words)
===========================================

REQUIREMENTS:
1. Provide 2-3 SPECIFIC, ACTIONABLE recommendations prioritized by impact
2. Tailor recommendations to score range (different advice for 85 vs. 55)
3. Include estimated costs and timelines (reference cost table)
4. Connect to other trust layers where relevant
5. Provide clear decision guidance (maintain/monitor/remediate/do-not-proceed)

RECOMMENDATION FRAMEWORK BY SCORE RANGE:

IF SCORE 80-100 (Strong Reliability):
Focus: Maintain edge + leverage strength

"Your strong reliability foundation provides three opportunities:

First, maintain this edge through preventive maintenance investments ($30K-$50K annually for monitoring systems and scheduled component replacement) to avoid regression as you scale from pilot to production. Reliability degrades without active investment—your current 82 score can easily slip to 70 if maintenance is deferred.

Second, leverage reliability as trust-builder for transparency (Layer 2): create a public-facing reliability dashboard showing real-time system status and historical uptime data. This makes your strong performance visible to stakeholders, converting technical reliability into perceived trustworthiness. Implementation cost: $40K-$80K for dashboard development and API integration.

Third, document your stress resilience as competitive differentiator when engaging with donors/partners. Your proven operation in [STRESS CONDITIONS] distinguishes you from competitors with untested claims, justifying premium positioning or preferred partner status in similar contexts."

IF SCORE 60-79 (Adequate but Monitor):
Focus: Targeted mitigation + close monitoring

"Your adequate reliability requires active monitoring and targeted mitigation before scaling:

Priority 1 – Address {{SPECIFIC_GAP_FROM_QUALITATIVE}}: The [STRESS SCENARIO] revealed [SPECIFIC_VULNERABILITY]. Implement [SPECIFIC_TECHNICAL_SOLUTION: e.g., UPS systems rated for ±30% voltage variation ($75K-$150K), offline-first architecture redesign ($150K-$300K), local spare parts inventory ($100K)]. Timeline: 4-6 months before scaling beyond current pilot. Without this, expect reliability to degrade from current 68 to 55-60 under scaled operational stress—creating adoption resistance.

Priority 2 – Establish reliability monitoring with triggered alerts: Current score likely represents 'average' that masks significant variation. Implement real-time monitoring ($30K-$50K) with alerts when uptime drops below 95% or unplanned downtime exceeds 1% in rolling 30-day window. This enables proactive intervention before reliability failures compound into trust failures.

Priority 3 – Quarterly reliability review for first 12 months of scaling: Reliability often degrades during scale-up as systems face stress not present in pilots. Commit to reassessment at 3, 6, 9, 12 months—if score drops below 65, pause scaling until remediated."

IF SCORE 40-59 (Significant Gaps):
Focus: Remediation required before scaling + alternative consideration

"Your reliability gaps create substantial adoption risk and require remediation before scaling beyond current limited pilot:

Critical Intervention Required – {{SPECIFIC_FUNDAMENTAL_ISSUE}}: The score of {{reliability_score}} indicates [SPECIFIC INTERPRETATION: e.g., 90-95% actual availability with 2-5% unplanned downtime and limited track record]. For {{sector}} technology in {{region}}, this is inadequate. Root cause: [IDENTIFIED_FROM_QUALITATIVE: e.g., system not rated for local power quality, no offline capability for connectivity gaps, inadequate local technical support]. 

Remediation path requires: [SPECIFIC_TECHNICAL_INTERVENTIONS with costs]. Estimated investment: $300K-$800K. Timeline: 6-12 months including field re-validation. Success criteria: Achieve >95% actual availability and <2% unplanned downtime over 6-month period in target deployment environment.

Alternative consideration: Given the significant investment and timeline required, evaluate whether alternative vendor/technology better suited to {{region}} conditions would be more viable. A system proven reliable in similar contexts (score 75+) may have higher upfront cost but lower total cost of ownership and faster path to successful adoption."

IF SCORE <40 (Unacceptable):
Focus: DO NOT PROCEED recommendation

"Your reliability score of {{reliability_score}}/100 triggers our DO NOT PROCEED threshold for {{sector}} technology deployment. 

This score indicates <90% actual availability with >5% unplanned downtime and no proven track record in operational context—creating unacceptable risk:

Operational Risk: Users experiencing >5% unplanned downtime will lose confidence rapidly. In {{sector}} contexts, this translates to [SPECIFIC_IMPACT: e.g., health clinic unable to access patient records during 1 in 20 visits, smart grid unable to balance load causing brownouts, etc.]. Unreliable technology becomes liability, not asset.

Trust Risk: Layer 1 deficits undermine all higher trust layers. Even if you have strong governance (Layer 3) and competent staff (Layer 4), chronic reliability failures destroy stakeholder confidence. No amount of transparency or governance can compensate for a system that doesn't work.

Recommendation: Do NOT proceed with current technology/vendor. Either:
(A) Require extensive field validation (12+ months proving >95% availability in target environment) before any commitment—vendor bears validation risk; OR
(B) Select alternative vendor/technology with proven track record (score 70+) in similar contexts.

The gap from 52 to acceptable minimum of 70 represents fundamental design/deployment mismatch, not minor optimization—remediation cost would likely exceed $500K-$1.5M with 12-18 month timeline and uncertain success probability."

CRITICAL ELEMENTS TO INCLUDE:
- Prioritized recommendations (most impactful first)
- Specific technical interventions (not generic "improve reliability")
- Cost estimates (reference cost table in context)
- Timeline estimates
- Success criteria or metrics
- Decision guidance (maintain/monitor/remediate/do-not-proceed)
- Connection to other layers where relevant

COST TRANSPARENCY:
Always provide cost ranges:
- "Estimated investment: $X-$Y"
- "Implementation timeline: N months"
- "Expected outcome: Score improvement from X to Y, translating to Z% reduction in adoption risk"

AVOID:
- Generic advice ("improve uptime," "monitor reliability")
- Recommendations without costs or timelines
- Ignoring the qualitative insights (every recommendation should connect to specific evidence)
- Missing the "so what" (why does this recommendation matter?)

===========================================
FORMAT REQUIREMENTS
===========================================

CRITICAL FORMATTING RULES:
1. Write as THREE flowing paragraphs with no headers, bullets, or numbered lists
2. Each paragraph should be 100-150 words (neither too brief nor excessively long)
3. Ground EVERY statement in provided data (cite scores, quote phrases from {{q3_text}}, reference benchmarks)
4. Use transition phrases between ideas for narrative flow
5. Maintain professional but accessible tone (avoid jargon unless necessary and defined)

PARAGRAPH TRANSITIONS:
- Paragraph 1 → 2: "However, the qualitative evidence reveals important nuances..."
- Paragraph 2 → 3: "To address these reliability considerations, three priorities emerge..."

TONE CALIBRATION:
- Technical precision without jargon overload
- Analytical but supportive (not harsh or judgmental)
- Honest about gaps without being alarmist
- Confident in recommendations without overstepping expertise

===========================================
QUALITY CHECKLIST (Self-Review Before Finalizing)
===========================================

Before submitting your analysis, verify:

☐ EVIDENCE-BASED
- Every claim cites specific score, benchmark, or quote from {{q3_text}}
- No unsupported assertions or generic platitudes

☐ CONTEXTUAL
- Considers {{org_type}}, {{sector}}, {{region}}, {{deployment_stage}}
- Maps stress scenarios to context-specific factors
- Recognizes patterns typical for this org type

☐ ACTIONABLE
- Recommendations are specific (not "improve reliability" but "implement UPS systems rated for ±30% voltage")
- Costs and timelines provided
- Success criteria defined

☐ BALANCED
- Acknowledges strengths where they exist
- Identifies gaps without being harsh
- Maintains supportive tone even when delivering difficult messages

☐ COMPLETE
- All three paragraphs present and appropriate length
- Addresses uptime, stress resilience, and remediation
- Provides clear decision guidance

☐ PROFESSIONAL
- No headers, bullets, or numbered lists (flowing prose)
- Appropriate technical depth (not oversimplified, not overly technical)
- Transitions between ideas
- Accessible language

===========================================
EXAMPLE OUTPUT COMPARISON
===========================================

❌ BAD EXAMPLE (Generic, unsupported, not actionable):
"Your reliability score is 68 out of 100. This is okay but could be better. You should work on improving your system's uptime and making sure it works consistently.
The incident you described shows that there are some problems with how the system handles stress. When things go wrong, it takes a while to fix them. This could be an issue as you scale up.
To improve, you should focus on reliability. Consider investing in better infrastructure and training your team. Make sure you have good support systems in place. Monitor your system regularly and address issues quickly."
WHY THIS IS BAD:
    • "okay but could be better" - vague, no interpretation
    • No benchmark comparison
    • "some problems" - what problems specifically?
    • "takes a while" - how long? what's acceptable?
    • "focus on reliability" - not actionable
    • "better infrastructure" - what infrastructure? at what cost?
    • No connection to qualitative data
    • No cost estimates or timelines
    • Generic advice that could apply to anything

✅ GOOD EXAMPLE (Specific, evidence-based, actionable):
"Your reliability score of 68/100 indicates 95-98% actual availability with 1-2% unplanned downtime, based on 4 months of controlled pilot testing in urban environments. This places you slightly below the DFI sector median of 74 and at the 48th percentile overall. While adequate for current pilot operations, the score reflects limited field validation in conditions significantly less challenging than your target rural Sub-Saharan Africa deployment context—where power quality is more variable and connectivity less stable—suggesting monitoring risk as you scale.
The incident described—a 6-hour system outage caused by voltage surge during harmattan season—reveals inadequate protection for Sub-Saharan African power quality, where voltage fluctuations of ±20% are routine rather than exceptional. The system experienced abrupt failure requiring manual restart by local operators, but could not resume full functionality until vendor remote support restored corrupted configuration files 8 hours after power returned (MTTR: 14 hours total). This pattern reveals two vulnerabilities: first, inadequate surge protection for local grid conditions; second, dependency on vendor remote support for recovery procedures local operators cannot execute independently. Both vulnerabilities will amplify as you scale to more remote locations with less stable power and poorer connectivity for vendor support access.
To address these reliability considerations before scaling, three priorities emerge: First, implement UPS systems with surge protection rated for ±30% voltage variation ($100K-$150K for 20-site initial rollout), eliminating the root cause of the documented failure and similar future incidents. Second, redesign recovery procedures to be locally executable without vendor remote access, including comprehensive troubleshooting documentation and hands-on training for field technicians ($50K-$75K, 3-month timeline). Third, establish quarterly reliability monitoring during your first year of scaling—if actual availability drops below 93% or unplanned downtime exceeds 2% in any 90-day period, pause further rollout until root causes are identified and remediated. Combined investment of $150K-$225K over 6 months would raise your projected reliability score from 68 to 75-80, significantly reducing adoption resistance as you move from urban pilot to rural scale."
WHY THIS IS GOOD:
    • Specific metrics (95-98% availability, 1-2% downtime)
    • Clear benchmark comparison with interpretation
    • Explicit track record context (4 months, urban, controlled)
    • Detailed stress scenario analysis (voltage surge, harmattan, 14-hour MTTR)
    • Two specific vulnerabilities identified
    • Three prioritized recommendations with: 
        ◦ Specific technical solutions (UPS rated for ±30%)
        ◦ Cost ranges ($100K-$150K)
        ◦ Timelines (3 months, 6 months)
        ◦ Success metrics (93% availability threshold)
    • Expected outcome (score 68→75-80)
    • All claims grounded in data provided