#!/bin/bash

echo "🔍 Verifying DNS Setup for caddy.team"
echo "====================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check A record
echo "Checking A record for caddy.team..."
A_RECORD=$(dig +short caddy.team @1.1.1.1)
if [[ "$A_RECORD" == *"76.76.21.21"* ]] || [[ "$A_RECORD" == *"76.76.21.61"* ]] || [[ "$A_RECORD" == *"76.223.126"* ]]; then
    echo -e "${GREEN}✅ A record configured correctly${NC}"
    echo "   Points to: $A_RECORD"
else
    echo -e "${YELLOW}⚠️  A record not found or incorrect${NC}"
    echo "   Current value: $A_RECORD"
    echo "   Expected: 76.76.21.21 (or Vercel IP)"
fi

echo ""

# Check CNAME for www
echo "Checking CNAME record for www.caddy.team..."
WWW_RECORD=$(dig +short www.caddy.team @1.1.1.1 | tail -1)
if [[ "$WWW_RECORD" == *"vercel"* ]] || [[ "$WWW_RECORD" == *"76."* ]]; then
    echo -e "${GREEN}✅ WWW record configured correctly${NC}"
    echo "   Points to: $WWW_RECORD"
else
    echo -e "${YELLOW}⚠️  WWW record not found or incorrect${NC}"
    echo "   Current value: $WWW_RECORD"
fi

echo ""

# Check HTTPS
echo "Checking HTTPS connection..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -I https://caddy.team 2>/dev/null)
if [ "$HTTP_STATUS" == "200" ] || [ "$HTTP_STATUS" == "308" ] || [ "$HTTP_STATUS" == "301" ]; then
    echo -e "${GREEN}✅ HTTPS is working${NC}"
    echo "   Status code: $HTTP_STATUS"
else
    echo -e "${YELLOW}⚠️  HTTPS not responding as expected${NC}"
    echo "   Status code: $HTTP_STATUS"
fi

echo ""

# Check SSL Certificate
echo "Checking SSL Certificate..."
SSL_INFO=$(echo | openssl s_client -connect caddy.team:443 -servername caddy.team 2>/dev/null | openssl x509 -noout -issuer 2>/dev/null)
if [[ "$SSL_INFO" == *"Cloudflare"* ]] || [[ "$SSL_INFO" == *"Let's Encrypt"* ]]; then
    echo -e "${GREEN}✅ SSL Certificate is valid${NC}"
    echo "   Issuer: $SSL_INFO"
else
    echo -e "${YELLOW}⚠️  SSL Certificate might need attention${NC}"
    echo "   Info: $SSL_INFO"
fi

echo ""

# Check Vercel
echo "Checking Vercel configuration..."
npx vercel domains inspect caddy.team 2>/dev/null | grep -E "(configured properly|not configured)" | head -1

echo ""
echo "====================================="
echo ""

# Summary
echo "📊 Summary:"
if [[ "$A_RECORD" == *"76."* ]] && [ "$HTTP_STATUS" == "200" ]; then
    echo -e "${GREEN}✅ Your domain is properly configured!${NC}"
    echo ""
    echo "🎉 Your site should be available at:"
    echo "   • https://caddy.team"
    echo "   • https://www.caddy.team"
else
    echo -e "${YELLOW}⚠️  DNS configuration in progress${NC}"
    echo ""
    echo "Please ensure you've added these records in Cloudflare:"
    echo "   • A record: @ → 76.76.21.21"
    echo "   • CNAME record: www → cname.vercel-dns.com"
    echo ""
    echo "DNS propagation can take 5-30 minutes. Please wait and try again."
fi