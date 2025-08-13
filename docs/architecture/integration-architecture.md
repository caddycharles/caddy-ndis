# Integration Architecture

## NDIS Portal Integration (Future)

```typescript
// integrations/ndis.ts
export class NDISIntegration {
  private readonly baseUrl = 'https://api.ndis.gov.au/v1';
  private readonly apiKey: string;
  
  async validateParticipant(ndisNumber: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/participants/${ndisNumber}/validate`,
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.ok;
    } catch (error) {
      // Fallback to manual validation
      return this.manualValidation(ndisNumber);
    }
  }
  
  async submitClaim(claim: Claim): Promise<ClaimResponse> {
    const ndisFormat = this.transformToNDISFormat(claim);
    
    const response = await fetch(`${this.baseUrl}/claims`, {
      method: 'POST',
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ndisFormat),
    });
    
    if (!response.ok) {
      throw new NDISClaimError(await response.text());
    }
    
    return response.json();
  }
  
  private transformToNDISFormat(claim: Claim): NDISClaim {
    return {
      provider_registration: process.env.NDIS_PROVIDER_ID,
      claim_reference: claim.id,
      services: claim.services.map(service => ({
        participant_number: service.participant.ndisNumber,
        service_date: format(service.serviceDate, 'yyyy-MM-dd'),
        support_item: service.supportItem,
        quantity: service.duration / 60, // Convert to hours
        unit_price: service.rate,
        gst_code: 'P', // GST free
      })),
    };
  }
}
```

## Email Service Integration

```typescript
// integrations/email.ts
export class EmailService {
  private readonly sendgrid: SendGrid;
  
  async sendServiceReminder(
    participant: Participant,
    service: Service
  ): Promise<void> {
    const template = await this.loadTemplate('service-reminder');
    const html = this.renderTemplate(template, {
      participant,
      service,
      worker: service.user,
    });
    
    await this.sendgrid.send({
      to: participant.email,
      from: 'noreply@caddy.team',
      subject: `Upcoming service with ${service.user.firstName}`,
      html,
      trackingSettings: {
        clickTracking: { enable: false },
        openTracking: { enable: true },
      },
    });
    
    await this.logEmail({
      type: 'service-reminder',
      recipient: participant.email,
      status: 'sent',
    });
  }
}
```

---
