# CSV Import/Export Requirements

## Import Format (Xero Contacts Compatible)

Based on the sample CSV provided, the system will support the following mapping:

### Required Fields
- **ContactName** → Participant Full Name
- **AccountNumber** → NDIS Number (extract numeric portion)
- **FirstName** → First Name
- **LastName** → Last Name

### Optional Fields
- **EmailAddress** → Primary Email
- **PhoneNumber** → Primary Phone
- **MobileNumber** → Mobile Phone
- **AddressLine1-4** → Address components
- **City** → City
- **Region** → State
- **PostalCode** → Postcode
- **Country** → Country

### Import Process
1. **Upload**: Accept CSV files up to 10MB
2. **Preview**: Show first 10 rows with field mapping
3. **Mapping**: Allow custom field mapping with smart defaults
4. **Validation**:
   - NDIS number format (9-10 digits)
   - Required fields present
   - Duplicate detection
5. **Import**: Process with progress indicator
6. **Report**: Summary of imported/failed records with downloadable error log

## Export Formats

### Participant Export
```csv
NDIS_Number,First_Name,Last_Name,Email,Phone,Plan_Start,Plan_End,Total_Budget,Status
430043674,Alberina,D'Ambrosio,sam@aboutyoucompany.com.au,62883443,2024-01-01,2024-12-31,50000.00,Active
```

### Claims Export (NDIS Bulk Upload Format)
```csv
Registration_Number,NDIS_Number,Service_Date,Support_Item,Quantity,Unit_Price,GST_Code,Claim_Reference
12345678,430043674,2024-03-15,01_011_0107_1_1,2.5,65.09,P,CLM-2024-001
```

### Budget Report Export
```csv
Participant,NDIS_Number,Category,Allocated,Spent,Remaining,Percentage_Used,Status
"John Smith",430043674,"Core Supports",25000.00,15000.00,10000.00,60%,Amber
```

---
