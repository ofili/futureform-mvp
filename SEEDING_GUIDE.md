# Manual Data Seeding Guide for RC/EC Credit System

This guide will help you manually seed the credit packages and pricing data using Prisma Studio.

## Step 1: Open Prisma Studio

Run the following command (already executed):
```bash
npx prisma studio
```

This will open Prisma Studio in your browser at `http://localhost:5555`

## Step 2: Seed Credit Packages

Navigate to the **CreditPackage** model and create the following 7 packages:

### RC Packages (4 total)

**1. Small Project Pack**
- name: `Small Project Pack`
- description: `Perfect for pilots and small team assessments`
- type: `RC`
- creditAmount: `10`
- priceUSD: `3500`
- features: `["10 Respondent Credits", "Basic Templates"]`
- isActive: `true`

**2. Standard Project Pack**
- name: `Standard Project Pack`
- description: `The standard for departmental or unit assessments`
- type: `RC`
- creditAmount: `25`
- priceUSD: `6250`
- features: `["25 Respondent Credits", "Advanced Templates", "Priority Support"]`
- isActive: `true`

**3. Organizational Pack**
- name: `Organizational Pack`
- description: `For comprehensive organizational diagnostics`
- type: `RC`
- creditAmount: `50`
- priceUSD: `11250`
- features: `["50 Respondent Credits", "Custom Questions", "Success Manager"]`
- isActive: `true`

**4. High-Volume Pack**
- name: `High-Volume Pack`
- description: `For large scale deployments`
- type: `RC`
- creditAmount: `100`
- priceUSD: `17500`
- features: `["100 Respondent Credits", "Volume Discount"]`
- isActive: `true`

### EC Packages (3 total)

**5. Starter Monitoring**
- name: `Starter Monitoring`
- description: `Essential evidence collection`
- type: `EC`
- creditAmount: `500`
- priceUSD: `500`
- features: `["500 Evidence Credits", "AE & VE Access"]`
- isActive: `true`

**6. Pro Verification**
- name: `Pro Verification`
- description: `Deep verification and continuous monitoring`
- type: `EC`
- creditAmount: `3000`
- priceUSD: `2500`
- features: `["3000 Evidence Credits", "All Layers Access", "Analyst Reviews"]`
- isActive: `true`

**7. Enterprise Intelligence**
- name: `Enterprise Intelligence`
- description: `High-volume signal processing`
- type: `EC`
- creditAmount: `15000`
- priceUSD: `10000`
- features: `["15000 Evidence Credits", "Custom Integrations", "SLA"]`
- isActive: `true`

## Step 3: Seed EC Pricing

Navigate to the **ECPricing** model and create the following 9 pricing rules:

### Assessment Evidence (AE) - 3 rules

**1. Standard Response**
- layer: `AE`
- type: `Standard Response`
- cost: `0`
- description: `Included with RC`
- isActive: `true`

**2. Document Upload**
- layer: `AE`
- type: `Document Upload`
- cost: `1`
- description: `Per file`
- isActive: `true`

**3. Link Submission**
- layer: `AE`
- type: `Link Submission`
- cost: `0.5`
- description: `Per URL`
- isActive: `true`

### Verification Evidence (VE) - 3 rules

**4. Analyst Review**
- layer: `VE`
- type: `Analyst Review`
- cost: `50`
- description: `Per hour`
- isActive: `true`

**5. Identity Check**
- layer: `VE`
- type: `Identity Check`
- cost: `5`
- description: `Per verification`
- isActive: `true`

**6. Company Check**
- layer: `VE`
- type: `Company Check`
- cost: `10`
- description: `Per verification`
- isActive: `true`

### Digital Signal Evidence (DSE) - 3 rules

**7. API Signal Check**
- layer: `DSE`
- type: `API Signal Check`
- cost: `0.1`
- description: `Per call`
- isActive: `true`

**8. Continuous Monitoring**
- layer: `DSE`
- type: `Continuous Monitoring`
- cost: `10`
- description: `Per asset/month`
- isActive: `true`

**9. Log Analysis**
- layer: `DSE`
- type: `Log Analysis`
- cost: `5`
- description: `Per GB`
- isActive: `true`

## Step 4: Initialize Credit Records for Organizations

For each organization in your database:

1. Navigate to the **RespondentCredit** model
2. Create a new record:
   - organizationId: `[select the organization]`
   - amount: `0` (or give them a welcome bonus)

3. Navigate to the **EvidenceCredit** model
4. Create a new record:
   - organizationId: `[select the organization]`
   - amount: `0` (or give them a welcome bonus)

## Step 5: Verify Data

After seeding, verify:
- ✅ 7 packages in CreditPackage table (4 RC + 3 EC)
- ✅ 9 pricing rules in ECPricing table (3 AE + 3 VE + 3 DSE)
- ✅ Each organization has 1 RespondentCredit record
- ✅ Each organization has 1 EvidenceCredit record

## Tips for Prisma Studio

- **Arrays**: When entering the `features` field, use JSON array format: `["item1", "item2"]`
- **Decimals**: For cost values like `0.5`, just enter the number directly
- **Enums**: Use the dropdown to select enum values (RC, EC, AE, VE, DSE)
- **Save**: Click "Save 1 change" button after each record

## Next Steps

After seeding the data:
1. Test the `/pricing` page to see the packages
2. Test the `/dashboard/credits` page to see balances
3. Try purchasing credits (if payment integration is ready)
4. Test assessment invitation with RC consumption
5. Test evidence submission with EC consumption
