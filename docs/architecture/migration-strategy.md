# Migration Strategy

## From Legacy Systems

```typescript
// migration/legacy.ts
export class LegacyMigration {
  async migrateFromXero(
    credentials: XeroCredentials
  ): Promise<MigrationResult> {
    // 1. Connect to Xero API
    const xero = await this.connectToXero(credentials);
    
    // 2. Export contacts (participants)
    const contacts = await xero.getContacts();
    
    // 3. Transform to Caddy format
    const participants = contacts.map(this.transformContact);
    
    // 4. Validate data
    const validation = await this.validateParticipants(participants);
    
    // 5. Import in batches
    const results = await this.batchImport(participants, {
      batchSize: 100,
      parallel: 5,
    });
    
    // 6. Generate migration report
    return {
      total: contacts.length,
      imported: results.success.length,
      failed: results.failed.length,
      errors: results.errors,
      report: await this.generateReport(results),
    };
  }
  
  private transformContact(xeroContact: any): Participant {
    return {
      firstName: xeroContact.FirstName,
      lastName: xeroContact.LastName,
      ndisNumber: this.extractNDISNumber(xeroContact.AccountNumber),
      email: xeroContact.EmailAddress,
      phone: xeroContact.Phones?.[0]?.PhoneNumber,
      address: {
        line1: xeroContact.Addresses?.[0]?.AddressLine1,
        line2: xeroContact.Addresses?.[0]?.AddressLine2,
        city: xeroContact.Addresses?.[0]?.City,
        state: xeroContact.Addresses?.[0]?.Region,
        postcode: xeroContact.Addresses?.[0]?.PostalCode,
      },
    };
  }
}
```

---
