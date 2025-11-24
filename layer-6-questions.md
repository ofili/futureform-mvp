# LAYER 6: ECOSYSTEM TRUST
## Complete Question Bank & Assessment Protocol

**Purpose**: Diagnose trust in the external environment and stakeholder ecosystem surrounding the technology deployment. Even excellent technology with competent organizations fails when dependencies are unreliable or stakeholders resist.

**Total Questions**: 78 across 2 domains, 6 sub-dimensions

---

## STRUCTURE & USAGE GUIDELINES

### Question Organization

**By Domain:**
- Domain 6.1: Upstream Dependencies (40 questions)
- Domain 6.2: Downstream Impacts & Stakeholder Trust (38 questions)

**By Stakeholder Type:**
- Infrastructure providers (power, connectivity, cloud)
- Regulatory authorities
- Policy makers
- End-users/beneficiaries
- Affected communities
- Civil society organizations (NGOs, activists)
- Business ecosystem (partners, competitors, suppliers)

**By Assessment Method:**
- Factual verification (dependency reliability data)
- Stakeholder interviews (trust perception)
- Document review (environmental assessments, engagement records)
- Observational protocols (community sentiment, infrastructure quality)
- Testing procedures (dependency stress testing)

### Scoring Framework

Each question maps to:
- Specific sub-dimension
- Scoring criteria (1-5 scale)
- Evidence weight (critical, high, medium, low)
- Red flags to watch for
- Triangulation requirements

---

# DOMAIN 6.1: UPSTREAM DEPENDENCIES

**Stakeholder Question**: *"Are the systems, services, and conditions this technology depends on reliable enough for successful deployment?"*

## Sub-Dimension 6.1.1: Infrastructure Dependencies

### PHYSICAL INFRASTRUCTURE ASSESSMENT

**Electrical Power Infrastructure**

1. **"What's the actual grid reliability in the deployment area? Provide uptime data for the past 12 months."**
   - Probe: Real reliability vs. claimed/planned
   - Evidence: Utility reports, user logs, independent monitoring
   - Red flag: <90% uptime, frequent unplanned outages
   - Scoring:
     - 5: >98% uptime, <2 hrs/month outage
     - 3: 90-98% uptime, 2-20 hrs/month outage
     - 1: <90% uptime, >20 hrs/month outage

2. **"Characterize power quality: voltage stability, frequency variation, surge/sag patterns."**
   - Probe: Not just availability—quality matters
   - Evidence: Power quality monitoring data, voltage logs
   - Red flag: ±15% voltage swings, frequent surges
   - Testing: Deploy power quality monitor for 30 days

3. **"What's the typical restoration time after outages? Who responds? How quickly?"**
   - Probe: Mean time to repair (MTTR) for power
   - Evidence: Utility response logs, user experiences
   - Red flag: >12 hours typical restoration time

4. **"Is backup power available? What type? Capacity? Reliability?"**
   - Probe: Generator, battery, solar backup systems
   - Evidence: Backup system inventory, maintenance logs
   - Red flag: No backup or unreliable backup

5. **"What percentage of facilities in deployment area have access to grid power?"**
   - Probe: Electrification rate (rural areas may be <50%)
   - Evidence: National statistics, local surveys
   - Red flag: <80% grid access in deployment zone

**Internet/Connectivity Infrastructure**

6. **"What's actual internet availability and reliability in deployment area over past 12 months?"**
   - Probe: Uptime, not just coverage
   - Evidence: ISP reports, user experience logs, speed tests
   - Red flag: <85% uptime, frequent multi-day outages
   - Scoring:
     - 5: >95% uptime, consistent speeds
     - 3: 85-95% uptime, variable speeds
     - 1: <85% uptime, unreliable

7. **"What bandwidth is actually available? Upload and download speeds at peak usage?"**
   - Probe: Real speeds vs. advertised (often 30-50% of claimed)
   - Evidence: Speed test data over 30-day period, multiple times of day
   - Red flag: <50% of system requirements at peak

8. **"What's latency to critical cloud services/APIs from deployment location?"**
   - Probe: Round-trip time affects real-time systems
   - Evidence: Ping tests, traceroute analysis
   - Red flag: >200ms latency, >5% packet loss

9. **"How many ISPs operate in the area? What redundancy exists?"**
   - Probe: Single point of failure vs. diverse connectivity
   - Evidence: ISP coverage maps, redundancy options
   - Red flag: Single ISP, no backup connectivity option

10. **"What happens during extreme weather? Connectivity track record during storms/monsoons?"**
    - Probe: Seasonal reliability patterns
    - Evidence: Historical outage correlation with weather events
    - Red flag: Multi-day outages during predictable weather patterns

**Physical Environment & Climate**

11. **"What are temperature extremes in deployment environment? Actual data, not assumptions."**
    - Probe: Equipment operating range vs. environment
    - Evidence: 12-month temperature data, microclimate analysis
    - Red flag: Temps exceed equipment specs >10% of time

12. **"What environmental stresses exist? Humidity, dust, salt air, UV exposure?"**
    - Probe: Environmental factors affecting equipment longevity
    - Evidence: Environmental monitoring, equipment failure patterns
    - Red flag: Harsh environment without mitigation

13. **"Are deployment sites accessible year-round? Road conditions, flooding, seasonal access?"**
    - Probe: Can maintenance/repair reach sites when needed?
    - Evidence: Site visit during challenging season, access logs
    - Red flag: Sites inaccessible >30 days/year

### DIGITAL INFRASTRUCTURE DEPENDENCIES

**Cloud Services & APIs**

14. **"What cloud services does the system depend on? List all with SLAs."**
    - Probe: Comprehensive dependency mapping
    - Evidence: Architecture diagrams, service contracts
    - Red flag: Critical dependencies with <99% SLA

15. **"What's the actual uptime of critical cloud dependencies over past 12 months?"**
    - Probe: Real performance vs. SLA commitments
    - Evidence: Provider status pages, monitoring data
    - Red flag: SLA breaches, unexplained outages

16. **"Can the system operate if cloud connectivity is lost? For how long? What degrades?"**
    - Probe: Offline capability, edge computing, local caching
    - Evidence: Offline mode testing, degraded operation documentation
    - Red flag: System completely inoperable without cloud
    - Scoring:
      - 5: Full offline operation for 72+ hours
      - 3: Partial operation for 24-72 hours
      - 1: Inoperable without cloud connectivity

17. **"Are critical APIs rate-limited? What happens if limits are exceeded?"**
    - Probe: API scalability and failure modes
    - Evidence: API documentation, load testing results
    - Red flag: Low rate limits causing frequent throttling

18. **"What data residency requirements exist? Where is cloud data stored? Any sovereignty issues?"**
    - Probe: Legal/regulatory data localization compliance
    - Evidence: Data residency policies, regulatory requirements
    - Red flag: Data stored in jurisdictions with legal/political risks

**Third-Party Service Providers**

19. **"What third-party services are critical to operation? Payment processors, identity providers, data providers?"**
    - Probe: Full dependency chain mapping
    - Evidence: Service provider contracts, integration points
    - Red flag: >5 critical third-party dependencies

20. **"What's the financial stability and longevity of critical third-party providers?"**
    - Probe: Third-party vendor risk assessment
    - Evidence: Provider financial health, market presence
    - Red flag: Critical dependency on financially unstable provider

21. **"If a third-party provider fails or exits, what's the fallback plan?"**
    - Probe: Dependency resilience strategy
    - Evidence: Contingency plans, alternative provider assessments
    - Red flag: No contingency for critical dependencies

### DEPENDENCY RISK ASSESSMENT

**Dependency Mapping Exercise**

22. **"Map all dependencies in order of criticality. For each, assess: probability of failure × impact if fails."**
    - Probe: Systematic risk quantification
    - Evidence: Dependency inventory with risk scores
    - Scoring: Risk matrix (5x5) for each dependency

23. **"For top 5 critical dependencies, what's MTTR if they fail?"**
    - Probe: Restoration time for each dependency
    - Evidence: Historical restoration data, provider commitments
    - Red flag: Any critical dependency with MTTR >24 hours

24. **"Can you demonstrate system operation in 'degraded dependency mode'? Which dependencies can fail without system failure?"**
    - Probe: Graceful degradation capability
    - Testing: Simulate dependency failures, observe system behavior
    - Scoring:
      - 5: System maintains >70% functionality with any single dependency failure
      - 3: System maintains 40-70% functionality
      - 1: Any single dependency failure causes system failure

25. **"What's the historical correlation between dependency failures and system failures?"**
    - Probe: Past dependency-caused incidents
    - Evidence: Incident logs, root cause analyses
    - Red flag: Frequent cascading failures from dependencies

## Sub-Dimension 6.1.2: Regulatory & Policy Environment

### REGULATORY STABILITY ASSESSMENT

**Current Regulatory Framework**

26. **"What regulatory approvals are required for deployment? Are they secured or pending?"**
    - Probe: Regulatory prerequisite completion status
    - Evidence: Approval certificates, pending application status
    - Red flag: Operating without required approvals
    - Scoring:
      - 5: All approvals secured, valid, up-to-date
      - 3: Most approvals secured, some pending (low-risk)
      - 1: Critical approvals missing or expired

27. **"How long did regulatory approval process take? Was timeline predictable?"**
    - Probe: Regulatory process efficiency and uncertainty
    - Evidence: Application-to-approval timeline, comparable cases
    - Red flag: >2× expected timeline, unpredictable delays

28. **"Are there pending regulatory changes that could affect this deployment?"**
    - Probe: Regulatory horizon scanning
    - Evidence: Legislative pipelines, regulatory agency announcements
    - Red flag: Proposed regulations threatening deployment viability

29. **"What's the track record of regulatory stability in this sector? Historical policy shifts?"**
    - Probe: Regulatory volatility assessment
    - Evidence: 5-10 year regulatory history analysis
    - Red flag: Major policy reversals in past 5 years

**Regulatory Enforcement & Compliance Risk**

30. **"How actively is this sector regulated? Frequency of inspections, audits, enforcement actions?"**
    - Probe: Regulatory scrutiny level
    - Evidence: Enforcement statistics, sector norms
    - Red flag: Frequent enforcement actions, arbitrary inspections

31. **"Have similar deployments faced regulatory challenges? What happened?"**
    - Probe: Precedent analysis for regulatory risk
    - Evidence: Case studies, regulatory actions against peers
    - Red flag: Multiple similar deployments shut down or fined

32. **"Is regulatory interpretation consistent or do different officials apply rules differently?"**
    - Probe: Regulatory predictability and corruption risk
    - Evidence: Stakeholder interviews, legal assessments
    - Red flag: Arbitrary enforcement, inconsistent interpretations

33. **"What's the appeals/dispute process if regulatory issues arise?"**
    - Probe: Regulatory recourse availability
    - Evidence: Administrative law procedures, dispute timelines
    - Red flag: No practical recourse, kangaroo courts

### POLITICAL & POLICY RISK

**Political Stability**

34. **"What's the political stability of jurisdictions where deployment occurs?"**
    - Probe: Regime stability, policy continuity risk
    - Evidence: Political risk indices, recent political transitions
    - Red flag: Recent coups, civil unrest, authoritarian transitions
    - Scoring:
      - 5: Stable democracy, strong institutions, policy continuity
      - 3: Moderate stability, some political risk manageable
      - 1: High political instability, regime change likely

35. **"Are there upcoming elections that could shift policy toward this technology?"**
    - Probe: Electoral cycle risks
    - Evidence: Election calendars, party positions on technology
    - Red flag: Election within 12 months, anti-technology platforms

36. **"Is this technology politically sensitive or caught in partisan debates?"**
    - Probe: Politicization risk
    - Evidence: Media analysis, political discourse monitoring
    - Red flag: Technology is campaign issue or ideological battleground

**Policy Alignment**

37. **"Does this deployment align with government development priorities and industrial policy?"**
    - Probe: Strategic fit with national/local policy goals
    - Evidence: Development plans, policy documents, budget allocations
    - Red flag: Technology contradicts stated government priorities
    - Scoring:
      - 5: Explicitly prioritized in national/local plans, budget allocated
      - 3: Generally aligned, not explicitly prioritized
      - 1: Contradicts policy priorities or ignored

38. **"Are there government champions or sponsors for this type of deployment?"**
    - Probe: Political backing and air cover
    - Evidence: Official statements, champion identification, support letters
    - Red flag: No political support, champions are opposition figures

39. **"What's the government's track record on similar technology initiatives? Success or failure pattern?"**
    - Probe: Institutional capability to support technology deployment
    - Evidence: Historical technology project outcomes
    - Red flag: Pattern of failed technology initiatives, 'white elephants'

40. **"Are there competing government initiatives or vendors? Inter-agency conflicts?"**
    - Probe: Bureaucratic competition and turf wars
    - Evidence: Stakeholder mapping, interagency relationships
    - Red flag: Competing initiatives from rival agencies, turf battles

---

# DOMAIN 6.2: DOWNSTREAM IMPACTS & STAKEHOLDER TRUST

**Stakeholder Question**: *"Do the people and organizations affected by this deployment trust it enough to adopt, support, or accept it?"*

## Sub-Dimension 6.2.1: Stakeholder Identification & Mapping

### COMPREHENSIVE STAKEHOLDER INVENTORY

**Primary Stakeholders (Direct Interaction)**

41. **"Who are the end-users who will directly operate or interact with this technology?"**
    - Probe: User persona definition, population size
    - Evidence: User research, demographic analysis
    - Purpose: Define primary beneficiary group

42. **"Who are secondary beneficiaries (indirect value recipients)?"**
    - Probe: Broader impact beyond direct users
    - Evidence: Value chain analysis, impact mapping
    - Purpose: Identify extended stakeholder network

43. **"Who is negatively affected? Who loses status, income, or power from this deployment?"**
    - Probe: Winner/loser analysis (critical for resistance prediction)
    - Evidence: Economic impact assessment, interviews with potentially displaced groups
    - Red flag: Powerful stakeholders face losses with no compensation
    - Scoring:
      - 5: No significant losers, or losers adequately compensated
      - 3: Some losers, manageable resistance
      - 1: Powerful losers with capacity to block deployment

**Influencers & Gatekeepers**

44. **"Who has veto power or approval authority over this deployment?"**
    - Probe: Formal authority mapping
    - Evidence: Organizational charts, legal requirements
    - Purpose: Identify critical gatekeepers

45. **"Who are informal influencers? Community leaders, opinion shapers, media figures?"**
    - Probe: Informal power structure
    - Evidence: Social network analysis, community interviews
    - Purpose: Identify informal veto players

46. **"Which civil society organizations (NGOs, advocacy groups) care about this technology/sector?"**
    - Probe: Activist landscape mapping
    - Evidence: NGO research, social media monitoring
    - Red flag: Active opposition from influential NGOs

47. **"Who are the 'early adopters' or champions? Who will help drive adoption?"**
    - Probe: Change agent identification
    - Evidence: Innovation diffusion analysis, stakeholder segmentation
    - Purpose: Identify amplifiers for trust-building

### STAKEHOLDER POWER-INTEREST MATRIX

48. **"For each stakeholder group, map: [High/Low Power] × [High/Low Interest]"**
    - Probe: Stakeholder prioritization framework
    - Evidence: Systematic assessment of influence and interest
    - Purpose: Focus engagement on High Power / High Interest stakeholders first

**Scoring each stakeholder group:**

| Power/Interest | High Power | Low Power |
|----------------|------------|-----------|
| **High Interest** | **Manage Closely** (critical) | **Keep Informed** |
| **Low Interest** | **Keep Satisfied** | **Monitor** |

49. **"Which stakeholder groups are in the 'Manage Closely' quadrant (High Power + High Interest)?"**
    - Probe: Critical stakeholder identification
    - Evidence: Power-interest matrix population
    - Red flag: >3 stakeholder groups in 'Manage Closely' without engagement plan

## Sub-Dimension 6.2.2: Stakeholder Trust Assessment

### TRUST MEASUREMENT PROTOCOL

**For Each Major Stakeholder Group, Assess:**

**Awareness Level**

50. **"What percentage of stakeholders are aware of this deployment? How did they learn?"**
    - Probe: Information reach and channels
    - Evidence: Surveys, focus groups, media reach analysis
    - Red flag: <50% awareness among directly affected stakeholders
    - Scoring:
      - 5: >80% aware, accurate understanding
      - 3: 50-80% aware, some misconceptions
      - 1: <50% aware, or widespread misinformation

**Perception & Trust**

51. **"What's the overall sentiment toward this deployment among stakeholders? Positive/Neutral/Negative?"**
    - Probe: Sentiment analysis
    - Evidence: Surveys (quantitative), focus groups (qualitative), social media sentiment analysis
    - Scoring:
      - 5: >70% positive sentiment
      - 3: Mixed (40-70% positive)
      - 1: Majority negative (<40% positive)

52. **"Do stakeholders trust the technology itself? Specific concerns or fears?"**
    - Probe: Technology-specific trust drivers
    - Evidence: Stakeholder interviews focusing on technology perceptions
    - Red flag: Safety fears, privacy concerns, job displacement anxiety

53. **"Do stakeholders trust the organizations deploying this technology? Why or why not?"**
    - Probe: Institutional trust assessment
    - Evidence: Trust surveys, reputation research
    - Red flag: Deploying organizations seen as exploitative, foreign, or corrupt

54. **"Do stakeholders believe this technology will benefit them or others? Who benefits in their view?"**
    - Probe: Perceived benefit distribution
    - Evidence: Stakeholder mental models of value capture
    - Red flag: "This is for elites, not for us" narrative

55. **"What are the top 3 concerns or fears stakeholders express about this deployment?"**
    - Probe: Risk perception mapping
    - Evidence: Open-ended qualitative research, concern frequency analysis
    - Purpose: Understand objections to address

**Influence & Action Potential**

56. **"Have stakeholders organized? Are there coalitions, movements, or campaigns related to this deployment?"**
    - Probe: Organized opposition assessment
    - Evidence: NGO activity, petition drives, protests, social media campaigns
    - Red flag: Active organized resistance with media engagement

57. **"What's stakeholder capacity to block, delay, or disrupt deployment?"**
    - Probe: Resistance capability assessment
    - Evidence: Historical precedent (have they blocked projects before?), resource assessment
    - Scoring:
      - 5: Stakeholders supportive or no blocking capacity
      - 3: Moderate capacity, manageable with engagement
      - 1: High capacity to block, actively mobilizing

58. **"What's stakeholder capacity to accelerate adoption if supportive?"**
    - Probe: Amplification potential of supporters
    - Evidence: Champion network analysis, mobilization capability
    - Purpose: Leverage supporters strategically

### ENGAGEMENT QUALITY ASSESSMENT

59. **"Has there been stakeholder consultation? When? How many sessions? Who attended?"**
    - Probe: Engagement extent and inclusiveness
    - Evidence: Engagement logs, attendance records, meeting minutes
    - Red flag: Single pro-forma consultation, low attendance, elite-only

60. **"Were consultations genuine (listening, adapting) or extractive (box-checking)?"**
    - Probe: Engagement quality and authenticity
    - Evidence: Stakeholder feedback on engagement quality, design changes resulting from input
    - Red flag: Stakeholders feel "consulted but ignored"
    - Scoring:
      - 5: Genuine dialogue, visible design adaptations from feedback
      - 3: Adequate consultation, some responsiveness
      - 1: Token consultation, no meaningful input incorporation

61. **"Are there ongoing engagement mechanisms or was it one-time?"**
    - Probe: Engagement sustainability
    - Evidence: Governance structures, regular forum schedules
    - Red flag: No ongoing engagement once deployment begins

62. **"Which stakeholder groups were NOT engaged? Why?"**
    - Probe: Engagement gaps
    - Evidence: Stakeholder mapping vs. engagement log comparison
    - Red flag: Powerful stakeholders or affected groups excluded

63. **"Can stakeholders access information about deployment? Is communication proactive or reactive?"**
    - Probe: Information transparency and accessibility
    - Evidence: Communication channels, information availability, language accessibility
    - Red flag: Information only available on request, in foreign language, or technical jargon

## Sub-Dimension 6.2.3: Fairness & Distributional Impact

### WINNER/LOSER ANALYSIS

**Access Fairness**

64. **"Who can access this technology? Are there barriers (cost, location, literacy, infrastructure)?"**
    - Probe: Equity of access assessment
    - Evidence: Access barrier analysis, inclusion/exclusion mapping
    - Red flag: Technology accessible only to elites, excluding marginalized groups
    - Scoring:
      - 5: Universal access or deliberate pro-poor targeting
      - 3: Broadly accessible with some barriers
      - 1: Elite-only access, structural exclusion

65. **"If access is unequal, is this acknowledged? Is there a plan to expand access over time?"**
    - Probe: Equity narrative and roadmap
    - Evidence: Inclusion strategy, expansion timelines
    - Red flag: Permanent inequality built into deployment design

**Cost & Benefit Distribution**

66. **"Who bears the costs of this deployment? (financial, risk, disruption)"**
    - Probe: Cost incidence analysis
    - Evidence: Economic modeling, stakeholder cost analysis
    - Red flag: Costs concentrated on vulnerable populations

67. **"Who captures the benefits? (convenience, income, savings, services)"**
    - Probe: Benefit incidence analysis
    - Evidence: Value capture modeling, benefit distribution assessment
    - Red flag: Benefits captured by external investors/elite users, not affected communities

68. **"Is the cost/benefit distribution perceived as fair by affected stakeholders?"**
    - Probe: Fairness perception (matters more than objective distribution)
    - Evidence: Stakeholder fairness assessments, justice framing analysis
    - Red flag: Widespread perception of unfairness or exploitation
    - Scoring:
      - 5: Widely perceived as fair or pro-poor
      - 3: Mixed perceptions, acceptable to most
      - 1: Widely seen as unfair or exploitative

**Risk Distribution**

69. **"Who bears risks if deployment fails or causes harm? (data breaches, safety incidents, job losses)"**
    - Probe: Risk burden analysis
    - Evidence: Risk allocation assessment, liability frameworks
    - Red flag: Users/communities bear all downside risk, deployers protected

70. **"Are there compensation or insurance mechanisms for harms?"**
    - Probe: Harm mitigation and justice mechanisms
    - Evidence: Insurance policies, compensation funds, redress procedures
    - Red flag: No accountability for harms, victims uncompensated

**Employment & Livelihoods**

71. **"Will this technology displace workers? How many? What happens to them?"**
    - Probe: Displacement impact assessment
    - Evidence: Labor market analysis, displacement estimates, transition plans
    - Red flag: Significant displacement (>20% of workforce) with no transition support

72. **"Are there retraining, redeployment, or compensation programs for displaced workers?"**
    - Probe: Just transition planning
    - Evidence: Workforce transition programs, severance terms, retraining initiatives
    - Scoring:
      - 5: Comprehensive transition support, no forced displacement
      - 3: Adequate transition support for most
      - 1: No transition support, forced displacement

## Sub-Dimension 6.2.4: Social License to Operate

### LEGITIMACY ASSESSMENT

**Legal Legitimacy**

73. **"Are all legal approvals, licenses, and permits secured?"**
    - Probe: Legal compliance status
    - Evidence: Permit documentation, legal compliance audit
    - Red flag: Operating in legal gray zone or without approvals
    - Scoring:
      - 5: Fully licensed, all approvals current
      - 3: Most approvals secured, minor gaps
      - 1: Major legal compliance gaps

**Social Legitimacy**

74. **"Do affected communities view this deployment as legitimate and acceptable?"**
    - Probe: Community acceptance beyond legal compliance
    - Evidence: Community surveys, social license assessments, qualitative research
    - Red flag: Legal but socially rejected ("not in my backyard")
    - Scoring:
      - 5: Strong community support, champions present
      - 3: Passive acceptance, neutral
      - 1: Active community opposition

75. **"Are there cultural, religious, or social norms that conflict with this technology?"**
    - Probe: Socio-cultural compatibility
    - Evidence: Anthropological assessment, community leader consultations
    - Red flag: Technology violates deeply held cultural or religious values

### CREDIBILITY ASSESSMENT

**Deployer Credibility**

76. **"Do stakeholders view the deploying organizations as trustworthy and competent?"**
    - Probe: Institutional credibility
    - Evidence: Trust surveys, reputation research, track record analysis
    - Red flag: Deployers seen as incompetent, corrupt, or exploitative
    - Scoring:
      - 5: Trusted institutions, strong track record
      - 3: Neutral credibility, unknown entities
      - 1: Distrusted institutions, poor track record

77. **"Have deploying organizations operated in this community before? What's the legacy?"**
    - Probe: Historical relationship quality
    - Evidence: Community memory research, past project outcomes
    - Red flag: Prior projects failed, left community worse off, or involved broken promises

78. **"Are respected local institutions or leaders endorsing this deployment?"**
    - Probe: Third-party credibility transfer
    - Evidence: Endorsement letters, partnership agreements, public statements
    - Red flag: No local champions, or local leaders opposing

### COMPOSITE SOCIAL LICENSE SCORE

**Social License Framework:**

| Component | Weight | Score (1-5) | Evidence |
|-----------|--------|-------------|----------|
| **Legal Legitimacy** | 25% | ___ | All permits secured? |
| **Social Acceptance** | 30% | ___ | Community support level? |
| **Credibility** | 25% | ___ | Trust in deployers? |
| **Ongoing Engagement** | 20% | ___ | Meaningful consultation? |
| **TOTAL** | 100% | **___** | **Social License Score** |

**Interpretation:**
- **4.5-5.0**: Strong social license—community champions deployment, broad legitimacy
- **4.0-4.4**: Good social license—passive community acceptance, neutral support
- **3.5-3.9**: Conditional social license—acceptance contingent on performance, monitoring needed
- **3.0-3.4**: Weak social license—organized skepticism, some opposition, fragile acceptance
- **<3.0**: No social license—active community resistance, deployment at risk

---

## LAYER 6 COMPOSITE SCORING

### Domain-Level Scoring

**Domain 6.1: Upstream Dependencies Score**

```
Domain 6.1 = (Infrastructure Dependencies × 0.60) +
             (Regulatory & Policy Environment × 0.40)
```

- Infrastructure (60%): Existential—if power/internet fail, system fails
- Regulatory (40%): Can shut down deployment but less frequent

**Domain 6.2: Downstream Impacts & Stakeholder Trust Score**

```
Domain 6.2 = (Stakeholder Trust × 0.40) +
             (Fairness & Distribution × 0.30) +
             (Social License to Operate × 0.30)
```

- Stakeholder Trust (40%): Most critical—resistance kills adoption
- Fairness (30%): Perceived unfairness mobilizes opposition
- Social License (30%): Formal legitimacy requirement

### Layer 6 Composite Score

```
Layer 6 Score = (Upstream Dependencies × 0.50) +
                (Downstream Stakeholder Trust × 0.50)
```

**Equal weighting rationale**: Both can independently kill deployment—unreliable dependencies or stakeholder resistance.

---

## CRITICAL RED FLAGS: LAYER 6 VETO CRITERIA

**Do NOT proceed if:**

1. **Infrastructure Dependency Failure** (Score <2.5)
   - Critical dependency (power/internet) <85% reliable with no mitigation
   - System cannot operate in degraded dependency mode
   - MTTR for critical dependencies >48 hours

2. **Regulatory/Political Risk** (Score <2.5)
   - Operating without required legal approvals
   - High political instability with technology at risk
   - Pending regulatory changes likely to ban/restrict deployment

3. **Stakeholder Opposition** (Score <2.5)
   - Active organized resistance from High Power stakeholders
   - >60% negative sentiment among affected populations
   - No social license, community actively blocking deployment

4. **Distributional Injustice** (Score <2.5)
   - Technology creates significant losers with no compensation
   - Benefits captured by elites, costs borne by vulnerable
   - Widespread perception of exploitation or unfairness

---

## ASSESSMENT DELIVERABLES: LAYER 6 OUTPUTS

### 1. Dependency Map (Visual)
- All upstream dependencies mapped
- Color-coded by reliability (green/yellow/red)
- MTTR for each dependency
- Mitigation status

### 2. Stakeholder Matrix
- Power/Interest mapping (2×2 matrix)
- Trust score for each stakeholder group
- Engagement status (engaged/not engaged)
- Risk level (supporter/neutral/opponent)

### 3. Social License Scorecard
- 4-component assessment (legitimacy, acceptance, credibility, engagement)
- Composite social license score
- Red flags and risks
- Recommendations

### 4. Winner/Loser Analysis
- Who gains? (benefits, access, power)
- Who loses? (costs, displacement, harm)
- Fairness perception assessment
- Mitigation recommendations

### 5. Ecosystem Trust Risk Register
- Top 10 ecosystem risks ranked by (probability × impact)
- Mitigation status for each risk
- Residual risk after mitigation
- Risk ownership and monitoring plan

---

## INTEGRATION WITH LAYERS 1-5

### How Layer 6 Complements Other Layers:

**Layer 1 (Reliability) + Layer 6:**
- Layer 1 asks: "Does the technology work?"
- Layer 6 asks: "Will the environment let it work?"
- Example: System is reliable (Layer 1 = 4.5) but grid is unreliable (Layer 6.1 = 2.0) → system fails in practice

**Layer 2 (Transparency) + Layer 6:**
- Layer 2 asks: "Do users understand the technology?"
- Layer 6 asks: "Do affected parties trust how it will be used?"
- Example: System is transparent (Layer 2 = 4.0) but communities fear data misuse (Layer 6.2 = 2.5) → distrust despite transparency

**Layer 3 (Governance) + Layer 6:**
- Layer 3 asks: "Is accountability clear?"
- Layer 6 asks: "Does the regulatory environment support accountability?"
- Example: Good governance (Layer 3 = 4.2) but weak regulatory enforcement (Layer 6.1 = 2.8) → accountability on paper only

**Layer 4 (Competence) + Layer 6:**
- Layer 4 asks: "Can the organization operate this?"
- Layer 6 asks: "Will stakeholders let them operate it?"
- Example: High competence (Layer 4 = 4.5) but community opposition (Layer 6.2 = 2.0) → cannot deploy despite capability

**Layer 5 (Integrity) + Layer 6:**
- Layer 5 asks: "Will the vendor stay?"
- Layer 6 asks: "Will the ecosystem allow them to stay?"
- Example: Vendor committed (Layer 5 = 4.0) but regulatory environment hostile (Layer 6.1 = 2.2) → vendor forced to exit

---

## CASE STUDY: LAYER 6 IN ACTION

### Example: Smart Meter Deployment in Lagos, Nigeria

**Context**: 500,000 prepaid smart meters for residential customers, 2022-2024 deployment

---

#### **Domain 6.1: Upstream Dependencies Assessment**

**Infrastructure Dependencies (Score: 2.3/5.0 - POOR)**

*Power Infrastructure:*
- Grid reliability: 65% uptime (Q1-7, Q2-8)
- Voltage stability: ±25% swings common (Q2)
- MTTR: 8-24 hours typical, up to 72 hours in some areas (Q3)
- Backup: Few households have generators, none have UPS for meters (Q4)
- **Red Flag**: Grid unreliability undermines prepaid meter value proposition

*Connectivity Infrastructure:*
- 4G coverage: 70% in deployment area (Q6)
- Internet reliability: 78% uptime, frequent weekend outages (Q6)
- Bandwidth: 2-5 Mbps typical, often <1 Mbps peak hours (Q7)
- Multiple ISPs available, but all use same fiber backbone (Q9)
- **Red Flag**: Meters cannot report usage data reliably, defeating "real-time" monitoring purpose

*Digital Dependencies:*
- Cloud platform SLA: 99.5% but actual 97% due to connectivity issues (Q15)
- Meters cache 7 days of data locally if offline (Q16) - **Mitigating Factor**
- Payment API depends on bank networks (frequent weekend downtime) (Q17)

**Dependency Score: 2.3/5.0** → System technically capable but dependencies undermine value

---

**Regulatory & Policy Environment (Score: 3.8/5.0 - ADEQUATE)**

*Regulatory Framework:*
- Nigerian Electricity Regulatory Commission (NERC) approval secured (Q26)
- Approval process took 18 months (12 months expected) but completed (Q27)
- New metering regulations pending but favorable to smart meters (Q28)
- Sector historically stable, NERC credible (Q29)

*Political Context:*
- Government National Electrification Policy prioritizes metering (Q37)
- Minister of Power is champion, allocated ₦50B for metering (Q38)
- Election in 2023 created temporary uncertainty but policy continued (Q35)
- No competing government initiatives (Q40)

**Regulatory Score: 3.8/5.0** → Stable, supportive environment

**Domain 6.1 Composite: (2.3 × 0.60) + (3.8 × 0.40) = 2.9/5.0** → WEAK

---

#### **Domain 6.2: Downstream Impacts & Stakeholder Trust**

**Stakeholder Mapping:**

| Stakeholder | Power | Interest | Trust Score | Status |
|-------------|-------|----------|-------------|--------|
| Residential Customers | Low | High | 2.8/5.0 | Skeptical |
| Community Leaders | Medium | High | 3.5/5.0 | Cautiously Supportive |
| Electricity Distribution Company (DisCo) Staff | High | Medium | 2.2/5.0 | **Hostile** |
| NERC (Regulator) | High | High | 4.5/5.0 | Supportive |
| Consumer Rights NGOs | Medium | High | 3.0/5.0 | Monitoring |
| Meter Installers (Contractors) | Low | High | 4.2/5.0 | Supportive |

**Critical Finding**: DisCo staff (High Power, Medium Interest) are hostile - **RED FLAG**

---

**Stakeholder Trust Assessment (Score: 2.8/5.0 - WEAK)**

*Residential Customers (Primary Users):*

- **Awareness**: 60% aware meters coming, 40% learned from neighbors/rumors (Q50) - **Score: 3.0**
- **Sentiment**: Mixed - 45% positive, 35% neutral, 20% negative (Q51) - **Score: 3.0**
- **Technology Trust**: 
  - Concerns: "Meters will overcharge us" (Q52)
  - "DisCo will use meters to cheat us" 
  - "Prepaid means we pay more upfront"
  - **Score: 2.5** - significant distrust
- **Institutional Trust**: DisCo has reputation for corruption, estimated billing fraud (Q53) - **Score: 2.0**
- **Benefit Perception**: 55% believe meters benefit DisCo, not customers (Q54) - **Score: 2.5**
- **Top Concerns** (Q55):
  1. Cost increase
  2. Prepaid inconvenience (having to buy credit)
  3. Data privacy (DisCo selling usage data)

*DisCo Staff (Critical Gatekeepers):*

- **Awareness**: 100% aware (internal deployment) (Q50)
- **Sentiment**: 70% negative (Q51) - **Score: 1.5**
- **Technology Trust**: Fear job losses (meter readers eliminated) (Q52) - **Score: 1.0**
- **Organized Resistance**: Union threatened slowdown in installations (Q56) - **RED FLAG**
- **Blocking Capacity**: Can delay installations, sabotage meters, slow repairs (Q57) - **HIGH**

*Community Leaders:*

- **Engagement**: 8 town hall meetings, 200+ leaders consulted (Q59) - **Score: 4.0**
- **Responsiveness**: DisCo adjusted payment plans based on feedback (Q60) - **Score: 4.0**
- **Sentiment**: 65% supportive if implementation is fair (Q51) - **Score: 3.5**

**Stakeholder Trust Score: 2.8/5.0** - Significant resistance from critical stakeholder (DisCo staff)

---

**Fairness & Distributional Impact (Score: 3.2/5.0 - ADEQUATE)**

*Access Fairness:*
- Universal deployment plan (all customers get meters) (Q64) - **Score: 5.0**
- No cost to customers (government-subsidized) (Q64) - **Score: 5.0**

*Cost/Benefit Distribution:*
- **Customers**: Pay upfront for electricity (liquidity burden), but pay for actual usage vs. estimated bills (Q66, Q67)
- **DisCo**: Reduces commercial losses (non-payment), improves revenue collection
- **Government**: Subsidizes meters (₦50B investment)
- **Perception**: 55% see this as "DisCo benefit, customer burden" (Q68) - **Score: 2.5**

*Employment Impact:*
- ~2,000 meter readers will be displaced (Q71) - **RED FLAG**
- Retraining program offered: 1,200 slots for installer/maintenance roles (Q72)
- 800 workers unaccounted for in transition plan - **Gap**

**Fairness Score: 3.2/5.0** - Distributional concerns, but not catastrophic

---

**Social License to Operate (Score: 3.6/5.0 - ADEQUATE)**

| Component | Score | Evidence |
|-----------|-------|----------|
| **Legal Legitimacy** | 5.0 | NERC approval, all permits (Q73) |
| **Social Acceptance** | 3.0 | Mixed community support, skepticism high (Q74) |
| **Credibility** | 2.5 | DisCo has poor reputation, past billing fraud (Q76, Q77) |
| **Ongoing Engagement** | 4.0 | Regular town halls, responsive to feedback (Q59, Q60) |
| **Composite** | **3.6** | Conditional social license |

**Interpretation**: Legal but socially fragile - acceptance contingent on fair implementation

---

**Domain 6.2 Composite: (2.8 × 0.40) + (3.2 × 0.30) + (3.6 × 0.30) = 3.1/5.0** → WEAK

---

#### **Layer 6 Composite Score**

```
Layer 6 = (Domain 6.1 × 0.50) + (Domain 6.2 × 0.50)
        = (2.9 × 0.50) + (3.1 × 0.50)
        = 3.0/5.0 - WEAK (bordering on HIGH RISK)
```

---

#### **Critical Findings & Recommendations**

**VETO TRIGGERS (None met, but close):**
- Infrastructure dependencies score 2.3 (threshold: <2.5) - **Just above veto**
- DisCo staff trust score 2.2 (threshold: <2.5 for critical stakeholders) - **Just above veto**

**RED FLAGS:**
1. ⚠️ **Grid unreliability undermines meter value** (65% uptime means meters offline 35% of time)
2. ⚠️ **DisCo staff actively hostile** (can sabotage installations, slow repairs)
3. ⚠️ **Customer distrust of DisCo** (history of corruption, billing fraud)
4. ⚠️ **800 displaced workers with no transition plan** (could organize resistance)

**DECISION: CONDITIONAL PROCEED**
- Layer 6 score 3.0 = Proceed, but HIGH RISK
- Requires active risk mitigation before scaling

**MITIGATION ROADMAP:**

*Priority 1: Address DisCo Staff Resistance (6 months)*
- Negotiate with union: guarantee no forced layoffs, retraining for all
- Create 400 additional maintenance/installer positions
- Revenue-sharing model: staff bonuses tied to collection improvements
- **Target**: Increase DisCo staff trust from 2.2 → 3.5

*Priority 2: Build Customer Trust (Ongoing)*
- Transparency campaign: publish actual vs. estimated billing comparison
- Customer protection: price lock for 6 months, dispute resolution hotline
- Community champions: recruit 100 satisfied early adopters as ambassadors
- **Target**: Increase customer trust from 2.8 → 3.8

*Priority 3: Mitigate Infrastructure Dependencies (12 months)*
- Lobby NERC for grid reliability improvements in metered areas (priority maintenance)
- Extend meter local storage from 7 days → 30 days (offline resilience)
- Partner with mobile network operators for redundant connectivity (not just ISPs)
- **Target**: Increase infrastructure dependency score from 2.3 → 3.0

*Priority 4: Just Transition for Displaced Workers (3 months)*
- Expand retraining program: 2,000 slots (covers all displaced workers)
- Severance package: 6 months pay + health insurance for those who leave
- Guarantee: No forced layoffs for 2 years (attrition only)
- **Target**: Reduce employment impact resistance

**PHASED DEPLOYMENT RECOMMENDATION:**
- **Phase 1 (Pilot)**: 10,000 meters in communities with highest trust scores (Q48 analysis)
- **Phase 2 (Expand)**: 50,000 meters after Phase 1 validates trust-building, staff cooperation
- **Phase 3 (Scale)**: 440,000 meters only if Layer 6 score improves to 3.5+

**MONITORING PLAN:**
- **Monthly**: DisCo staff sentiment surveys, customer complaint tracking
- **Quarterly**: Layer 6 reassessment (full stakeholder trust audit)
- **Triggers for Pause**: DisCo staff trust <2.0, customer complaints >10% of installations, organized community resistance

---

## FIELD ASSESSMENT PROTOCOLS: LAYER 6

### Protocol 1: Infrastructure Dependency Site Assessment (3-5 days)

**Preparation:**
- Deploy power quality monitors at 10 representative sites (7 days before assessment)
- Deploy internet connectivity monitors (30 days before assessment)
- Obtain utility outage logs (12 months historical)

**Day 1-2: Power Infrastructure Assessment**
- Review power quality data: voltage stability, outage frequency/duration
- Interview utility operations staff: typical failure modes, MTTR, backup protocols
- Site visits to substations: condition, maintenance, capacity
- Test backup power systems (if present): capacity, reliability, switchover time

**Day 3: Connectivity Infrastructure Assessment**
- Review connectivity monitoring data: uptime, bandwidth, latency
- Test connection to critical cloud services: latency, packet loss, failover
- Interview ISP representatives: network topology, redundancy, support SLAs
- Identify single points of failure in connectivity chain

**Day 4: Dependency Stress Testing**
- Simulate power failure: observe system graceful degradation
- Simulate connectivity loss: test offline mode, local caching, data sync on reconnect
- Simulate API failure: test system behavior with third-party service unavailable
- Document: What fails? What degrades? What continues operating?

**Day 5: Dependency Risk Workshop**
- Map all dependencies with operations team
- Quantify: probability of failure × impact if fails × MTTR
- Prioritize top 10 dependency risks
- Develop mitigation plan for each critical dependency

**Deliverable**: Infrastructure Dependency Risk Register with mitigation roadmap

---

### Protocol 2: Stakeholder Trust Audit (4-6 weeks)

**Week 1: Stakeholder Identification & Mapping**
- Comprehensive stakeholder inventory (Q41-Q47)
- Power-Interest matrix population (Q48-Q49)
- Identify critical stakeholders (High Power + High Interest)
- Design stakeholder-specific assessment approach

**Week 2-3: Quantitative Trust Assessment**
- **Surveys** (200-500 respondents per major stakeholder group):
  - Awareness questions (Q50)
  - Sentiment questions (Q51)
  - Trust questions (Q52-Q54)
  - Concern identification (Q55)
  - Demographic/segmentation data
- **Sampling**: Stratified by geography, demographics, stakeholder type
- **Administration**: Mix of in-person, phone, mobile (SMS/WhatsApp)

**Week 3-4: Qualitative Trust Assessment**
- **Focus Groups** (8-12 groups, 8-10 participants each):
  - Separate groups by stakeholder type
  - Explore: perceptions, fears, aspirations, conditions for support
  - Identify: narratives, mental models, decision drivers
- **Key Informant Interviews** (20-30 interviews):
  - Community leaders, opinion shapers, gatekeepers
  - In-depth: trust drivers, influence networks, engagement quality

**Week 4-5: Engagement Quality Assessment**
- Review engagement history: who consulted, when, how (Q59-Q63)
- Interview engaged stakeholders: was consultation genuine or extractive? (Q60)
- Identify engagement gaps: who was not consulted? (Q62)
- Assess information accessibility: can stakeholders get deployment info? (Q63)

**Week 5-6: Analysis & Reporting**
- Quantitative analysis: trust scores by stakeholder group
- Qualitative analysis: thematic analysis of focus groups/interviews
- Pattern identification: common concerns, trust/distrust drivers
- Segmentation: which stakeholder segments are supporters/opponents/persuadables?

**Deliverable**: Stakeholder Trust Report with trust scores, segmentation, engagement recommendations

---

### Protocol 3: Fairness & Impact Assessment (2-3 weeks)

**Week 1: Winner/Loser Analysis**
- Economic modeling: who gains/loses financially (Q64-Q68)
- Access analysis: who can/cannot access technology (Q64-Q65)
- Risk burden analysis: who bears risks of failure (Q69-Q70)
- Employment impact: displacement estimates, vulnerable groups (Q71-Q72)

**Week 2: Fairness Perception Research**
- Focus groups on fairness: do stakeholders see distribution as just? (Q68)
- Justice framing analysis: how is fairness being discussed?
- Reference point identification: what do stakeholders compare to?
- Compensation adequacy: do losers see mitigation as fair?

**Week 3: Recommendations**
- Distributional adjustment options: how to make more equitable
- Compensation design: for losers/displaced
- Access expansion: pathway to universal access if currently limited
- Communication strategy: framing fairness narrative

**Deliverable**: Fairness & Impact Report with distributional analysis and equity recommendations

---

### Protocol 4: Social License Assessment (1-2 weeks)

**Legal Legitimacy Audit** (Q73)
- Verify all permits, licenses, approvals current and valid
- Identify any pending approvals or regulatory gaps
- Assess: operating legally or in gray zone?

**Social Acceptance Assessment** (Q74-Q75)
- Community surveys: legitimacy, acceptability (distinct from trust)
- Cultural compatibility assessment: any norms/values conflicts?
- "Not In My Backyard" analysis: legal but locally rejected?

**Credibility Assessment** (Q76-Q78)
- Deployer reputation research: trust in institutions
- Historical legacy analysis: past projects, community memory
- Endorsement inventory: which respected figures/institutions support?

**Engagement Quality Review** (Q59-Q63 - overlap with Protocol 2)
- Consultation authenticity: genuine vs. extractive
- Ongoing engagement mechanisms: one-time or sustained
- Responsiveness: has feedback changed design?

**Social License Scorecard**
- Score each component (1-5): legal legitimacy, social acceptance, credibility, engagement
- Composite social license score
- Interpretation: strong/good/conditional/weak/none

**Deliverable**: Social License Assessment with recommendations for strengthening legitimacy

---

## INTEGRATION CHECKLIST: CONNECTING LAYER 6 TO LAYERS 1-5

When conducting Layer 6 assessment, explicitly check for interactions with other layers:

### **Layer 1 (Reliability) × Layer 6 Cross-Check**

- [ ] If Layer 1 scores high (4.0+), check: will infrastructure dependencies undermine that reliability in practice?
- [ ] If Layer 6.1 (dependencies) scores low (<3.0), reassess Layer 1 score downward
- [ ] Example: System is 99% reliable in lab (Layer 1 = 5.0), but grid is 70% reliable (Layer 6.1 = 2.0) → effective reliability is ~70%, not 99%

### **Layer 2 (Transparency) × Layer 6 Cross-Check**

- [ ] If Layer 2 scores high (4.0+), check: do stakeholders trust the transparency or see it as surveillance?
- [ ] If Layer 6.2 (stakeholder trust) identifies privacy fears, reassess Layer 2 approach
- [ ] Example: System provides full operational visibility (Layer 2 = 4.5), but communities fear data misuse (Layer 6.2 = 2.5) → transparency creates distrust, not trust

### **Layer 3 (Governance) × Layer 6 Cross-Check**

- [ ] If Layer 3 scores high (4.0+), check: is regulatory environment stable enough to enforce governance?
- [ ] If Layer 6.1 (regulatory risk) is high, governance may be unenforceable
- [ ] Example: Strong SLAs and contracts (Layer 3 = 4.5), but weak/corrupt regulators (Layer 6.1 = 2.0) → governance is paper-only

### **Layer 4 (Competence) × Layer 6 Cross-Check**

- [ ] If Layer 4 scores high (4.0+), check: will stakeholder resistance prevent competent operation?
- [ ] If Layer 6.2 (stakeholder trust) shows organized opposition, operations will be disrupted
- [ ] Example: Well-trained operators (Layer 4 = 4.5), but DisCo staff sabotaging installations (Layer 6.2 = 2.0) → competence cannot be deployed

### **Layer 5 (Integrity) × Layer 6 Cross-Check**

- [ ] If Layer 5 scores high (4.0+), check: will regulatory/political environment force vendor exit?
- [ ] If Layer 6.1 (regulatory stability) is low, even committed vendors may be forced out
- [ ] Example: Vendor is committed (Layer 5 = 4.5), but new government bans foreign tech providers (Layer 6.1 = 1.5) → commitment irrelevant, forced exit

---

## FINAL LAYER 6 ASSESSMENT DELIVERABLE TEMPLATE

### **Layer 6: Ecosystem Trust Assessment Report**

**Executive Summary** (2 pages)
- Layer 6 Composite Score: ___/5.0
- Domain 6.1 (Upstream Dependencies): ___/5.0
- Domain 6.2 (Downstream Stakeholder Trust): ___/5.0
- Overall Risk Level: [Low/Moderate/High/Critical]
- **Decision Recommendation**: [Proceed/Conditional Proceed/Reconsider/Do Not Proceed]
- Top 3 Ecosystem Risks
- Top 3 Mitigation Priorities

---

**Section 1: Infrastructure Dependency Assessment** (5-7 pages)
- Power infrastructure reliability analysis
- Connectivity infrastructure analysis
- Digital dependency assessment (cloud, APIs, third-party services)
- Dependency risk matrix (probability × impact × MTTR)
- Critical dependencies requiring mitigation
- Score: ___/5.0

**Section 2: Regulatory & Policy Environment** (3-5 pages)
- Regulatory approval status
- Regulatory stability assessment
- Political risk analysis
- Policy alignment with government priorities
- Pending regulatory changes
- Score: ___/5.0

**Section 3: Stakeholder Mapping & Trust** (6-8 pages)
- Comprehensive stakeholder inventory
- Power-Interest matrix (visual)
- Trust scores by stakeholder group
- Sentiment analysis (positive/neutral/negative %)
- Organized resistance assessment
- Engagement quality evaluation
- Score: ___/5.0

**Section 4: Fairness & Distributional Impact** (4-5 pages)
- Winner/loser analysis
- Access equity assessment
- Cost/benefit distribution
- Employment impact analysis
- Fairness perception findings
- Score: ___/5.0

**Section 5: Social License to Operate** (3-4 pages)
- Legal legitimacy status
- Social acceptance level
- Deployer credibility assessment
- Engagement quality summary
- Composite social license score
- Score: ___/5.0

**Section 6: Risk Register & Mitigation Roadmap** (4-6 pages)
- Top 10 ecosystem risks ranked
- Mitigation strategies for each risk
- Mitigation timeline (short/medium/long term)
- Mitigation cost estimates
- Residual risk after mitigation
- Risk ownership and monitoring plan

**Section 7: Decision Framework & Recommendations** (3-4 pages)
- Layer 6 composite score calculation
- Integration with Layers 1-5 (cross-check findings)
- Deployment readiness assessment
- Go/No-Go recommendation with conditions
- Phased deployment strategy (if conditional proceed)
- Monitoring and reassessment plan

---

**Appendices**
- A: Infrastructure Dependency Data (power quality logs, connectivity monitoring)
- B: Stakeholder Survey Results (quantitative data)
- C: Focus Group & Interview Transcripts (qualitative data, anonymized)
- D: Fairness Analysis Data (economic modeling, distributional tables)
- E: Social License Scorecard (detailed component scoring)

---

**Report Length**: 30-40 pages + appendices

---

This completes the **Layer 6: Ecosystem Trust Question Bank** — 78 questions across 6 sub-dimensions, with protocols, case study, and deliverable template.

**Layer 6 is now operational and ready for field deployment.**