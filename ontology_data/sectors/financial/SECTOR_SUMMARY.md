# Financial Services & Mobile Money - Sector Summary

## Sector Context: Sub-Saharan Africa

### Key Characteristics
- **70% unbanked** in many SSA countries
- **Mobile money dominance**: M-Pesa (Kenya), Airtel Money, MTN MoMo, Orange Money
- **USSD primary interface** (works on 2G, no smartphone needed)
- **Agent network critical** for cash-in/cash-out
- **Financial inclusion priority** for governments and development partners
- **Heavy regulation**: Central banks, AML/KYC, consumer protection

### Critical Differences from Global North
1. **USSD not apps**: Most transactions via USSD (*123#), not smartphone apps
2. **Agent dependency**: Cash-in/cash-out requires physical agents (not ATMs)
3. **Low-value transactions**: $1-$50 typical (not $100s)
4. **Informal sector**: Many users have no formal ID, employment
5. **Cross-border remittances**: Major use case (diaspora sending money home)
6. **SIM swap fraud**: Major attack vector (steal SIM, access account)

---

## Layer Adaptation Approach

### L1 - Reliability (12 questions)
**Focus**: USSD session reliability, agent network uptime, cross-border transactions

**Key Questions**:
- USSD session success rates (timeout issues common)
- Agent network availability (cash-in/cash-out uptime)
- Cross-border transaction reliability (M-Pesa Kenya ↔ Tanzania)
- Low-value transaction performance ($1-$10 transactions)
- SIM swap fraud recovery (account access restoration)
- Offline transaction queuing (sync when back online)

**Africa-Specific**:
- USSD works on 2G (critical for rural areas)
- Agent liquidity (do agents have cash?)
- SMS confirmations for every transaction (audit trail)

---

### L2 - Transparency (13 questions)
**Focus**: Fee transparency, exchange rates, credit scoring, data usage

**Key Questions**:
- Fee disclosure (all fees upfront: send, withdraw, FX)
- Exchange rate transparency (cross-border, no hidden markups)
- Transaction confirmations (SMS for every transaction)
- Credit scoring transparency (how are limits determined?)
- Data usage disclosure (transaction data sold to third parties?)
- Agent commission transparency

**Africa-Specific**:
- Fees must be clear to low-literacy users (visual, voice)
- Exchange rates critical for remittances
- Transaction history accessible via USSD (not just app)

---

### L3 - Governance (11 questions)
**Focus**: Central bank licensing, AML/KYC, consumer protection, agent governance

**Key Questions**:
- Central bank e-money licenses (all operating countries)
- AML/KYC compliance (for undocumented, illiterate users)
- Consumer dispute resolution (lost/stolen funds)
- Agent network governance (fraud prevention, accountability)
- Cross-border regulatory compliance (multiple countries)
- Data protection compliance (NDPR, DPA, POPIA)

**Africa-Specific**:
- KYC challenging (many lack formal ID)
- Agent fraud common (must have controls)
- 54 countries = 54 regulatory regimes

---

### L4 - Competence (16 questions)
**Focus**: User financial literacy, agent training, customer support, digital literacy

**Key Questions**:
- User financial literacy (first-time formal financial service users)
- Agent training (quality, fraud prevention, customer service)
- Customer support (local language, accessible)
- Digital literacy (USSD navigation, PIN security, scam awareness)
- Agent network capacity (liquidity, geographic coverage)

**Africa-Specific**:
- Many first-time users of formal financial services
- USSD navigation not intuitive (need training)
- Scams common (fake agents, phishing)
- Local language support critical

---

### L5 - Integrity (14 questions)
**Focus**: Financial stability, customer fund safety, exit planning, ethical practices

**Key Questions**:
- Financial stability (can survive regulatory changes?)
- Customer fund safety (segregated accounts, insurance?)
- Exit planning (what happens to funds if provider fails?)
- Ethical practices (no predatory fees, transparent pricing)
- Data security (fraud protection, hacking prevention)
- Local commitment (long-term presence)

**Africa-Specific**:
- Mobile money provider failures have occurred
- Customer funds must be protected
- Regulatory changes common (policy risk)

---

### L6 - Ecosystem (20 questions)
**Focus**: Mobile network dependency, agent network, banking integration, regulatory environment

**Key Questions**:
- Mobile network dependency (USSD gateway reliability)
- Agent network infrastructure (cash availability, security, accessibility)
- Banking system integration (bank-to-mobile money interoperability)
- Electricity access (agent POS devices need charging)
- Regulatory environment (central bank policies, telecom regulations)
- Competition (multiple providers - interoperability?)
- Trust & adoption (community acceptance, agent reputation)

**Africa-Specific**:
- USSD/SMS infrastructure critical (no data needed)
- Agent network is the "ATM network"
- Interoperability limited (M-Pesa doesn't talk to Airtel Money)
- Regulatory environment evolving rapidly

---

## Question Count: 86 Total
- L1 Reliability: 12 questions
- L2 Transparency: 13 questions
- L3 Governance: 11 questions
- L4 Competence: 16 questions
- L5 Integrity: 14 questions
- L6 Ecosystem: 20 questions

---

## Next: Generate all 6 layer files
