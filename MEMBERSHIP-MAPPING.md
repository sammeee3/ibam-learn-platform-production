# System.io to Platform Membership Mapping
**CRITICAL: Names must match EXACTLY**

## ✅ CORRECT MAPPING (Tag → Membership)

### System.io Tag → Platform Membership Name

| System.io Tag | Platform Shows | Database Stores |
|--------------|----------------|-----------------|
| **IBAM Impact Members** | IBAM Impact Members | ibam_member |
| **Entrepreneur Member** | Entrepreneur Member | entrepreneur |
| **Business Member** | Business Member | business |
| **Church Partner Small** | Small Church Partner | church_small |
| **Church Partner Large** | Large Church Partner | church_large |
| **Church Partner Mega** | Mega Church Partner | church_mega |

## ❌ INCORRECT (Never use these terms)
- ~~"Basic membership"~~ → Use "IBAM Impact Members"
- ~~"Premium membership"~~ → Use "Entrepreneur Member"
- ~~"Standard"~~ → Use actual membership name
- ~~"Pro"~~ → Use actual membership name

## 📋 HOW IT WORKS:

1. **Customer buys in System.io:**
   - Sees: "IBAM Impact Members - $10/month"
   - Gets tagged: "IBAM Impact Members"

2. **Webhook receives:**
   ```json
   {
     "tag": {
       "name": "IBAM Impact Members"
     }
   }
   ```

3. **Platform creates user with:**
   - Membership Name: "IBAM Impact Members"
   - Membership Key: "ibam_member" (internal only)
   - Display: "IBAM Impact Members"

4. **User sees in dashboard:**
   - "Welcome, IBAM Impact Member!"
   - "Your Membership: IBAM Impact Members"
   - "Tier: IBAM Impact Members"

## 🎯 KEY PRINCIPLE:
**What they buy = What they see**

The customer should ALWAYS see the exact same membership name everywhere:
- In System.io checkout
- In welcome email  
- In platform dashboard
- In their profile
- In billing statements

## 🚨 NEVER TRANSLATE OR SIMPLIFY:
- IBAM Impact Members ≠ Basic
- Entrepreneur Member ≠ Premium  
- Business Member ≠ Professional
- Church Partner Small ≠ Small Plan

## ✅ IMPLEMENTATION STATUS:
- **Code**: ✅ Correctly uses exact names
- **Database**: ✅ Stores correct membership names
- **Webhook Handler**: ✅ Maps tags correctly
- **UI Display**: ✅ Shows actual membership names
- **Email Templates**: ✅ Uses correct names

The platform is correctly configured to use the exact membership names from System.io!