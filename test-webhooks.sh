#!/bin/bash

echo "🧪 WEBHOOK CONFIGURATION TEST SCRIPT"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "📋 Testing STAGING Webhook..."
echo "URL: https://ibam-learn-platform-staging.vercel.app/api/webhooks/systemio"
echo "Tag: Staging Work Only"
echo ""

# Test staging webhook
STAGING_PAYLOAD='{"contact":{"email":"staging-test@example.com","tags":[{"name":"Staging Work Only"}]}}'
STAGING_SECRET="staging-secret-2025-secure"
STAGING_SIGNATURE=$(echo -n "$STAGING_PAYLOAD" | openssl dgst -sha256 -hmac "$STAGING_SECRET" -hex | cut -d' ' -f2)

STAGING_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST https://ibam-learn-platform-staging.vercel.app/api/webhooks/systemio \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: $STAGING_SIGNATURE" \
  -H "X-Webhook-Event: CONTACT_TAG_ADDED" \
  -d "$STAGING_PAYLOAD")

STAGING_HTTP_STATUS=$(echo "$STAGING_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
STAGING_BODY=$(echo "$STAGING_RESPONSE" | grep -v "HTTP_STATUS")

if [ "$STAGING_HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ STAGING WEBHOOK: WORKING${NC}"
    echo "Response: $STAGING_BODY"
else
    echo -e "${RED}❌ STAGING WEBHOOK: FAILED (HTTP $STAGING_HTTP_STATUS)${NC}"
    echo "Response: $STAGING_BODY"
fi

echo ""
echo "===================================="
echo ""
echo "📋 Testing PRODUCTION Webhook..."
echo "URL: https://ibam-learn-platform-v3.vercel.app/api/webhooks/systemio"
echo "Tag: IBAM Impact Members"
echo ""

# Test production webhook
PROD_PAYLOAD='{"contact":{"email":"prod-test@example.com","tags":[{"name":"IBAM Impact Members"}]}}'
PROD_SECRET="ibam-systeme-secret-2025"
PROD_SIGNATURE=$(echo -n "$PROD_PAYLOAD" | openssl dgst -sha256 -hmac "$PROD_SECRET" -hex | cut -d' ' -f2)

PROD_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST https://ibam-learn-platform-v3.vercel.app/api/webhooks/systemio \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: $PROD_SIGNATURE" \
  -H "X-Webhook-Event: CONTACT_TAG_ADDED" \
  -d "$PROD_PAYLOAD")

PROD_HTTP_STATUS=$(echo "$PROD_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
PROD_BODY=$(echo "$PROD_RESPONSE" | grep -v "HTTP_STATUS")

if [ "$PROD_HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ PRODUCTION WEBHOOK: WORKING${NC}"
    echo "Response: $PROD_BODY"
else
    echo -e "${RED}❌ PRODUCTION WEBHOOK: FAILED (HTTP $PROD_HTTP_STATUS)${NC}"
    echo "Response: $PROD_BODY"
fi

echo ""
echo "===================================="
echo ""
echo "📊 SUMMARY:"
echo ""

if [ "$STAGING_HTTP_STATUS" = "200" ] && [ "$PROD_HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ BOTH WEBHOOKS CONFIGURED CORRECTLY!${NC}"
    echo ""
    echo "System.io integration is working properly:"
    echo "• Staging tests go to staging database"
    echo "• Production purchases go to production database"
else
    echo -e "${YELLOW}⚠️ WEBHOOK CONFIGURATION NEEDS ATTENTION${NC}"
    echo ""
    echo "Check the following in Vercel Dashboard:"
    
    if [ "$STAGING_HTTP_STATUS" != "200" ]; then
        echo "• Staging: Verify IBAM_SYSTEME_SECRET = 'staging-secret-2025-secure'"
    fi
    
    if [ "$PROD_HTTP_STATUS" != "200" ]; then
        echo "• Production: Verify IBAM_SYSTEME_SECRET = 'ibam-systeme-secret-2025'"
    fi
fi

echo ""
echo "===================================="