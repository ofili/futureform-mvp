# Quick Reference: Credit System Seed Data

## 📦 CreditPackage (7 records)

### RC Packages
```
1. Small Project Pack | RC | 10 credits | $3,500
2. Standard Project Pack | RC | 25 credits | $6,250
3. Organizational Pack | RC | 50 credits | $11,250
4. High-Volume Pack | RC | 100 credits | $17,500
```

### EC Packages
```
5. Starter Monitoring | EC | 500 credits | $500
6. Pro Verification | EC | 3,000 credits | $2,500
7. Enterprise Intelligence | EC | 15,000 credits | $10,000
```

## 💰 ECPricing (9 records)

### AE Layer
```
1. Standard Response | AE | 0 EC | Included with RC
2. Document Upload | AE | 1 EC | Per file
3. Link Submission | AE | 0.5 EC | Per URL
```

### VE Layer
```
4. Analyst Review | VE | 50 EC | Per hour
5. Identity Check | VE | 5 EC | Per verification
6. Company Check | VE | 10 EC | Per verification
```

### DSE Layer
```
7. API Signal Check | DSE | 0.1 EC | Per call
8. Continuous Monitoring | DSE | 10 EC | Per asset/month
9. Log Analysis | DSE | 5 EC | Per GB
```

## 🏢 Initialize Credits for Each Organization

For each org, create:
- 1 RespondentCredit record (amount: 0)
- 1 EvidenceCredit record (amount: 0)

---

**Prisma Studio is running at:** http://localhost:5555

See `SEEDING_GUIDE.md` for detailed instructions.
