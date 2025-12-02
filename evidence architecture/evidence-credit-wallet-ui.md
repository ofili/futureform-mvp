# PART 2: EVIDENCE CREDIT WALLET UI SPECIFICATION

---

## EC Wallet Dashboard (Enterprise & Portfolio Users)

### Main Dashboard View

```
┌─────────────────────────────────────────────────────────────┐
│  Evidence Credit Wallet                                      │
│                                                              │
│  Current Balance: 23,847 EC                    [Top Up ▼]   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░                    │
│  74% remaining • Estimated 143 days at current usage        │
│                                                              │
│  💡 Recommended: Top up 10,000 EC to maintain buffer        │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Usage This Month                                           │
│                                                              │
│  2,847 EC consumed                                          │
│  ↑ 12% vs. last month                                       │
│                                                              │
│  Top Evidence Types:                                        │
│  • Daily operational signals: 1,240 EC (44%)                │
│  • LLV spot checks: 900 EC (32%)                            │
│  • API integrations: 580 EC (20%)                           │
│  • Premium verification: 127 EC (4%)                        │
│                                                              │
│  [View Detailed Usage →]                                    │
├─────────────────────────────────────────────────────────────┤
│  Active Monitoring                                          │
│                                                              │
│  18 companies being monitored                               │
│  5 digital signal integrations active                       │
│  2 LLV visits scheduled this month                          │
│                                                              │
│  [View Monitoring Dashboard →]                              │
├─────────────────────────────────────────────────────────────┤
│  Alerts & Recommendations                                   │
│                                                              │
│  ⚠️  3 companies showing trust degradation                   │
│  ℹ️  2 new API integrations available                        │
│  ✓  Last month's LLV reports completed                      │
│                                                              │
│  [Review Alerts →]                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## EC Usage Detail View

```
┌─────────────────────────────────────────────────────────────┐
│  Evidence Credit Usage                  [Export CSV ▼]       │
│                                                              │
│  Filters: [All Companies ▼] [Last 30 Days ▼] [All Types ▼] │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Nov 20, 2025                                               │
│                                                              │
│  Company: Solara Mini-Grids Ltd                             │
│  Evidence: Daily energy meter readings (30 sites)           │
│  EC Consumed: 15 EC (30 readings × 0.5 EC)                  │
│  Status: ✓ Validated                                        │
│                                                              │
│  Company: Solara Mini-Grids Ltd                             │
│  Evidence: LLV quarterly site verification                  │
│  EC Consumed: 15 EC                                         │
│  Status: 🔄 In Progress (Report due Nov 23)                 │
│                                                              │
│  Company: AgriTech Partners                                 │
│  Evidence: M-Pesa transaction history pull                  │
│  EC Consumed: 2 EC                                          │
│  Status: ✓ Validated                                        │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Nov 19, 2025                                               │
│                                                              │
│  Company: AgriTech Partners                                 │
│  Evidence: Government business registry check               │
│  EC Consumed: 2 EC                                          │
│  Status: ✓ Validated • Certificate renewed                 │
│                                                              │
│  Company: HealthLink Distribution                           │
│  Evidence: GPS fleet tracking (daily trace)                 │
│  EC Consumed: 0.5 EC                                        │
│  Status: ✓ Validated                                        │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Showing 1-5 of 847 entries                                 │
│  [← Previous] [Next →]                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## EC Top-Up Modal

```
┌─────────────────────────────────────────────────────────────┐
│  Top Up Evidence Credits                           [✕ Close] │
│                                                              │
│  Current Balance: 23,847 EC                                 │
│                                                              │
│  Select Package:                                            │
│                                                              │
│  ○ 2,500 EC - $1,800                                        │
│    • Best for: Single company annual monitoring            │
│                                                              │
│  ⦿ 10,000 EC - $6,500                                       │
│    • Best for: Multiple companies or high-frequency         │
│    • Most popular                                           │
│                                                              │
│  ○ 25,000 EC - $15,000                                      │
│    • Best for: Portfolio monitoring (10-20 companies)       │
│    • 40% volume discount                                    │
│                                                              │
│  ○ 100,000 EC - $50,000                                     │
│    • Best for: Large portfolios (30-50 companies)           │
│    • 50% volume discount                                    │
│                                                              │
│  ○ Custom Amount                                            │
│    [____] EC → Calculated price                             │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Payment Method                                             │
│                                                              │
│  ⦿ Credit Card ending in 4242 (Default)                     │
│  ○ Wire Transfer (Add 3-5 business days)                    │
│  ○ Add New Payment Method                                   │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Summary                                                    │
│                                                              │
│  10,000 EC                                      $6,500.00   │
│  Current balance                               +23,847 EC   │
│  New balance after purchase                     33,847 EC   │
│                                                              │
│  Estimated duration: 238 days at current usage              │
│                                                              │
│  ☑️ Auto-reload when balance drops below 5,000 EC           │
│                                                              │
│                                [Cancel]  [Complete Purchase]│
└─────────────────────────────────────────────────────────────┘
```

---

## EC Usage by Company View

```
┌─────────────────────────────────────────────────────────────┐
│  Evidence Usage by Company                [Export ▼]         │
│                                                              │
│  Period: Last 90 Days                                       │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Solara Mini-Grids Ltd                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░  2,847 EC (32%)  │
│  Trust Score: 78 → 81 (↑ 3 points)                          │
│  Last updated: Nov 20, 2025                                 │
│  • 1,350 EC: Daily signals (90 days × 15 sites)            │
│  • 900 EC: 3 quarterly LLV visits                           │
│  • 597 EC: API integrations & checks                        │
│  [View Details →]                                           │
│                                                              │
│  AgriTech Partners                                          │
│  ━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░░░░░░░░░░░  1,543 EC (17%)  │
│  Trust Score: 72 → 70 (↓ 2 points) ⚠️                       │
│  Last updated: Nov 19, 2025                                 │
│  • 810 EC: Transaction & financial monitoring               │
│  • 450 EC: 3 LLV verification visits                        │
│  • 283 EC: Government & credit checks                       │
│  [Review Degradation →]                                     │
│                                                              │
│  HealthLink Distribution                                    │
│  ━━━━━━━━━━━━━━━━░░░░░░░░░░░░░░░░░░░░░░░░  1,128 EC (13%)  │
│  Trust Score: 84 → 85 (↑ 1 point)                          │
│  Last updated: Nov 20, 2025                                 │
│  • 675 EC: GPS & logistics monitoring                       │
│  • 300 EC: 2 LLV warehouse inspections                      │
│  • 153 EC: Certification renewals                           │
│  [View Details →]                                           │
│                                                              │
│  [Show 15 more companies...]                                │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Total: 8,974 EC across 18 companies                        │
│  Average per company: 498 EC/90 days (~166 EC/month)        │
└─────────────────────────────────────────────────────────────┘
```

---

## EC Low Balance Alert

```
┌─────────────────────────────────────────────────────────────┐
│  ⚠️ Evidence Credit Balance Low                              │
│                                                              │
│  Your EC balance has dropped below your alert threshold.    │
│                                                              │
│  Current Balance: 4,847 EC                                  │
│  Alert Threshold: 5,000 EC                                  │
│                                                              │
│  At current usage (95 EC/day), you have ~51 days remaining. │
│                                                              │
│  Recommendations:                                           │
│  • Top up 10,000 EC now to avoid monitoring interruptions   │
│  • Enable auto-reload for peace of mind                     │
│  • Reduce monitoring frequency for non-critical companies   │
│                                                              │
│                        [Top Up Now]  [Adjust Settings]  [OK]│
└─────────────────────────────────────────────────────────────┘
```

---

## Auto-Reload Settings

```
┌─────────────────────────────────────────────────────────────┐
│  Evidence Credit Auto-Reload Settings                       │
│                                                              │
│  ☑️ Enable automatic top-up when balance is low             │
│                                                              │
│  When balance drops below:                                  │
│  [5,000] EC                                                 │
│                                                              │
│  Automatically purchase:                                    │
│  ○ 2,500 EC ($1,800)                                        │
│  ⦿ 10,000 EC ($6,500)                                       │
│  ○ 25,000 EC ($15,000)                                      │
│  ○ Custom: [____] EC                                        │
│                                                              │
│  Payment Method:                                            │
│  Credit Card ending in 4242                    [Change]     │
│                                                              │
│  Email Notifications:                                       │
│  ☑️ Notify me when auto-reload triggers                     │
│  ☑️ Send monthly usage summary                              │
│  ☑️ Alert when EC balance drops below threshold             │
│                                                              │
│                                          [Cancel]  [Save]   │
└─────────────────────────────────────────────────────────────┘
```

---

# PART 3: EC PACKAGE COMPARISON CHART

---

## Visual Comparison Table (for Website)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                       EVIDENCE CREDIT PACKAGES                                │
├──────────────┬───────────────┬────────────────┬────────────────┬─────────────┤
│              │ Monitoring    │ Monitoring     │ Portfolio      │ Portfolio   │
│              │ Starter       │ Growth         │ Essentials     │ Professional│
├──────────────┼───────────────┼────────────```
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│ EC INCLUDED  │ 500 EC        │ 2,500 EC       │ 25,000 EC      │ 100,000 EC  │
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│ PRICE        │ $400          │ $1,800         │ $15,000        │ $50,000     │
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│ PRICE PER EC │ $0.80         │ $0.72          │ $0.60          │ $0.50       │
│              │ (20% off)     │ (28% off)      │ (40% off)      │ (50% off)   │
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│ BEST FOR     │ 1 company     │ 1 company      │ 10-20          │ 30-50       │
│              │ 1-3 months    │ 6-12 months    │ companies      │ companies   │
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│ MONITORING   │               │                │                │             │
│ COVERAGE     │               │                │                │             │
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│ Daily        │ ✓ 30-90 days  │ ✓ 180-360 days │ ✓ Full year    │ ✓ Full year │
│ Digital      │               │                │ (all companies)│ (all)       │
│ Signals      │               │                │                │             │
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│ LLV Site     │ 4 visits      │ 16 visits      │ 160 visits     │ 650 visits  │
│ Verification │               │ (quarterly)    │ (quarterly ea) │ (monthly ea)│
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│ API          │ ✓ Basic       │ ✓ Standard     │ ✓ Advanced     │ ✓ Custom    │
│ Integrations │               │                │                │             │
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│ Premium      │ 50 checks     │ 250 checks     │ 2,500 checks   │ 10,000      │
│ Verification │               │                │                │ checks      │
│ (Gov/Credit) │               │                │                │             │
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│ FEATURES     │               │                │                │             │
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│ Trust Score  │ Quarterly     │ Monthly        │ Bi-weekly      │ Weekly      │
│ Updates      │               │                │                │             │
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│ Anomaly      │ Manual review │ Auto-detection │ Auto-detection │ Real-time   │
│ Detection    │               │                │ + alerts       │ + predictive│
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│ Dashboard    │ Basic         │ Standard       │ Portfolio      │ Portfolio   │
│              │               │                │ view           │ + analytics │
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│ Portfolio    │ —             │ —              │ ✓ Basic        │ ✓ Advanced  │
│ Analytics    │               │                │                │             │
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│ Comparative  │ —             │ —              │ ✓ Sector       │ ✓ Custom    │
│ Benchmarking │               │                │ benchmarks     │ peer sets   │
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│ SUPPORT      │               │                │                │             │
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│ Success      │ Email support │ Email support  │ ✓ Dedicated    │ ✓ Dedicated │
│ Manager      │               │                │ CSM            │ CSM         │
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│ Response     │ 48 hours      │ 24 hours       │ 12 hours       │ 4 hours     │
│ Time SLA     │               │                │                │             │
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│ Quarterly    │ —             │ —              │ ✓ Included     │ ✓ Included  │
│ Reviews      │               │                │                │             │
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│ TECHNICAL    │               │                │                │             │
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│ API Access   │ —             │ Read-only      │ ✓ Full API     │ ✓ Full API  │
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│ Webhooks     │ —             │ —              │ ✓ Included     │ ✓ Included  │
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│ Custom       │ —             │ —              │ 2 integrations │ Unlimited   │
│ Integrations │               │                │                │             │
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│ Export Data  │ PDF only      │ PDF + CSV      │ PDF/CSV/JSON   │ All formats │
│              │               │                │                │ + API       │
├──────────────┼───────────────┼────────────────┼────────────────┼─────────────┤
│              │ [Purchase]    │ [Purchase]     │ [Schedule Demo]│ [Contact]   │
└──────────────┴───────────────┴────────────────┴────────────────┴─────────────┘
```

---

# PART 4: EC ROI CALCULATOR (Interactive Tool)

---

## EC ROI Calculator UI

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EVIDENCE CREDIT ROI CALCULATOR                           │
│                                                                             │
│  See how FutureForm's continuous monitoring compares to traditional         │
│  site visit models                                                          │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Your Portfolio Details                                                     │
│                                                                             │
│  Number of portfolio companies:                                             │
│  [20____] companies                                                         │
│                                                                             │
│  Average site visit frequency:                                              │
│  ○ Quarterly (4x/year)                                                      │
│  ⦿ Semi-annual (2x/year)                                                    │
│  ○ Annual (1x/year)                                                         │
│                                                                             │
│  Average site visit cost:                                                   │
│  [$35,000] per visit                                                        │
│                                                                             │
│  Desired monitoring frequency:                                              │
│  ⦿ Continuous (daily signals)                                               │
│  ○ Weekly                                                                   │
│  ○ Monthly                                                                  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  COST COMPARISON                                                            │
│                                                                             │
│  ┌─────────────────────────────────┬─────────────────────────────────┐     │
│  │ TRADITIONAL MODEL               │ FUTUREFORM EC MODEL             │     │
│  ├─────────────────────────────────┼─────────────────────────────────┤     │
│  │ Annual Site Visits:             │ Initial Assessment:             │     │
│  │ 20 companies × 2 visits         │ Enterprise Program: $35,000     │     │
│  │ @ $35,000/visit                 │ (100 RC included)               │     │
│  │                                 │                                 │     │
│  │ = $1,400,000/year               │ Continuous Monitoring:          │     │
│  │                                 │ Portfolio Professional: $50,000 │     │
│  │ Frequency: 2 snapshots/year     │ (100,000 EC)                    │     │
│  │                                 │                                 │     │
│  │ Detection lag: 6 months avg     │ = $85,000/year                  │     │
│  │                                 │                                 │     │
│  │                                 │ Frequency: Daily signals        │     │
│  │                                 │                                 │     │
│  │                                 │ Detection lag: Real-time        │     │
│  └─────────────────────────────────┴─────────────────────────────────┘     │
│                                                                             │
│  YOUR SAVINGS                                                               │
│                                                                             │
│  Annual savings: $1,315,000                                                 │
│  Cost reduction: 94%                                                        │
│                                                                             │
│  ADDITIONAL BENEFITS                                                        │
│                                                                             │
│  ✓ 182x more frequent monitoring (daily vs. semi-annual)                    │
│  ✓ Real-time anomaly detection (vs. 6-month lag)                           │
│  ✓ Portfolio-wide trend analysis                                           │
│  ✓ Predictive risk modeling                                                │
│  ✓ Lower carbon footprint (95% fewer flights)                              │
│                                                                             │
│  [Download Full ROI Report] [Schedule Demo] [Share Results]                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# PART 5: CREDIT PURCHASE FLOW

---

## Step 1: Credit Selection

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Purchase Evidence Credits                                                  │
│                                                                             │
│  Step 1 of 3: Select Package                                               │
│  ━━━━━━━━━━━━░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                                │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  MONITORING PACKS (For Individual Companies)                                │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  ○  Monitoring Starter Pack                                          │  │
│  │     500 EC • $400 ($0.80/EC)                                         │  │
│  │     Perfect for: 1-3 months of basic monitoring                     │  │
│  │     • 30-90 days of daily signals                                    │  │
│  │     • OR 4 LLV verification visits                                   │  │
│  │     • OR 200 premium database checks                                 │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  ⦿  Monitoring Growth Pack                                 POPULAR   │  │
│  │     2,500 EC • $1,800 ($0.72/EC)                                     │  │
│  │     Perfect for: 6-12 months comprehensive monitoring                │  │
│  │     • Full year of multi-source digital signals                      │  │
│  │     • PLUS 4 quarterly LLV verification visits                       │  │
│  │     • PLUS 50 API/database cross-checks                              │  │
│  │     • PLUS monthly Trust Score updates                               │  │
│  │     ✓ 28% savings vs. base price                                     │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  ○  Monitoring Scale Pack                                            │  │
│  │     10,000 EC • $6,500 ($0.65/EC)                                    │  │
│  │     Perfect for: Annual comprehensive monitoring                     │  │
│  │     • High-frequency monitoring (multiple sources)                   │  │
│  │     • PLUS 12 monthly LLV spot checks                                │  │
│  │     • PLUS 100+ premium API integrations                             │  │
│  │     • PLUS weekly Trust Score updates                                │  │
│  │     ✓ 35% savings vs. base price                                     │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  PORTFOLIO POOLS (For Multiple Companies)                                  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  ○  Portfolio Essentials                                             │  │
│  │     25,000 EC • $15,000 ($0.60/EC)                                   │  │
│  │     Monitor 10-20 companies continuously                             │  │
│  │     ✓ 40% savings vs. base price                                     │  │
│  │     ✓ Portfolio dashboard included                                   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  ○  Portfolio Professional                        MOST POPULAR DFI   │  │
│  │     100,000 EC • $50,000 ($0.50/EC)                                  │  │
│  │     Monitor 30-50 companies with comprehensive intelligence          │  │
│  │     ✓ 50% savings vs. base price                                     │  │
│  │     ✓ Dedicated Customer Success Manager                             │  │
│  │     ✓ Advanced portfolio analytics                                   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ○  Custom EC Pool                                                          │
│     [________] EC → Calculated price                                        │
│     For 500,000+ EC or custom requirements [Contact Sales]                 │
│                                                                             │
│  Not sure which package? [Help me choose]                                  │
│                                                                             │
│                                           [Cancel]  [Continue to Payment →] │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Step 2: Payment Information

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Purchase Evidence Credits                                                  │
│                                                                             │
│  Step 2 of 3: Payment Information                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░░░░░░░░░                                │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Order Summary                                                              │
│                                                                             │
│  Monitoring Growth Pack                                                     │
│  2,500 Evidence Credits                                           $1,800.00 │
│                                                                             │
│  Current EC Balance: 847 EC                                                 │
│  Balance after purchase: 3,347 EC                                           │
│                                                                             │
│  Estimated duration: 118 days at current usage (28 EC/day)                 │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Payment Method                                                             │
│                                                                             │
│  ⦿  Credit Card                                                             │
│                                                                             │
│     Card Number                                                             │
│     [4242 4242 4242 4242___________________]  [💳 Visa]                     │
│                                                                             │
│     Expiration Date          CVV                                            │
│     [12] / [25]              [123]                                          │
│                                                                             │
│     Cardholder Name                                                         │
│     [Sarah Ochieng_________________________]                                │
│                                                                             │
│     Billing Address                                                         │
│     [Same as account address ▼]                                             │
│                                                                             │
│  ○  Wire Transfer / Bank Transfer                                           │
│     (Invoice will be sent • 3-5 business days processing)                   │
│                                                                             │
│  ○  Purchase Order                                                          │
│     (For Enterprise customers only • Net-30 terms)                          │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Additional Options                                                         │
│                                                                             │
│  ☑️  Enable auto-reload when balance drops below 500 EC                     │
│      Automatically purchase: [Monitoring Growth Pack ▼] ($1,800)            │
│                                                                             │
│  ☑️  Send receipt to: sarah.ochieng@africandfund.org                        │
│  ☑️  Add to monthly invoice (Enterprise customers only)                     │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Total Due Today: $1,800.00                                                 │
│                                                                             │
│  By completing this purchase, you agree to our Terms of Service            │
│  and Evidence Credit Terms.                                                 │
│                                                                             │
│                                        [← Back]  [Complete Purchase $1,800] │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Step 3: Confirmation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Purchase Complete! ✓                                                       │
│                                                                             │
│  Step 3 of 3: Confirmation                                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                                │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Thank you for your purchase!                                               │
│                                                                             │
│  2,500 Evidence Credits have been added to your account.                    │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Receipt Details                                                     │  │
│  │                                                                      │  │
│  │  Order #: FF-EC-2025-11-20-8472                                     │  │
│  │  Date: November 20, 2025                                            │  │
│  │                                                                      │  │
│  │  Monitoring Growth Pack                                             │  │
│  │  2,500 EC                                             $1,800.00     │  │
│  │                                                                      │  │
│  │  Payment Method: Visa •••• 4242                                     │  │
│  │  Status: Paid                                                       │  │
│  │                                                                      │  │
│  │  Receipt sent to: sarah.ochieng@africandfund.org                    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Your Updated Balance                                                       │
│                                                                             │
│  Previous Balance: 847 EC                                                   │
│  Credits Purchased: +2,500 EC                                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                                             │
│  New Balance: 3,347 EC                                                      │
│                                                                             │
│  Estimated duration: 118 days at current usage (28 EC/day)                 │
│                                                                             │
│  ✓ Auto-reload enabled (triggers at 500 EC)                                │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  What's Next?                                                               │
│                                                                             │
│  ✓ Your monitoring programs will continue uninterrupted                    │
│  ✓ New digital signal integrations are ready to activate                   │
│  ✓ Schedule additional LLV visits with your available credits              │
│                                                                             │
│  [View EC Dashboard]  [Download Receipt]  [Schedule More Monitoring]       │
│                                                                             │
│  Need help? Contact your Customer Success Manager:                         │
│  James Kimani • james.kimani@futureform.africa • +254 700 123 456          │
│                                                                             │
│                                                          [Return to Home →] │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

