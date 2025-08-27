#!/bin/bash

echo "🧪 Testing STAGING Webhook with Email"
echo "======================================"

# Full staging test payload with your email
PAYLOAD='{
  "contact": {
    "id": 99999,
    "email": "sammeee@yahoo.com",
    "registeredAt": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
    "fields": [
      {"fieldName": "First name", "slug": "first_name", "value": "Staging"},
      {"fieldName": "Surname", "slug": "surname", "value": "Test"}
    ],
    "tags": [{"id": 991808, "name": "Staging Work Only"}]
  },
  "tag": {"id": 991808, "name": "Staging Work Only"}
}'

# Staging secret
SECRET="staging-secret-2025-secure"

# Generate signature
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" -hex | cut -d' ' -f2)

echo "Sending webhook to STAGING..."
echo "Email should be sent to: sammeee@yahoo.com"
echo ""

# Send to staging
RESPONSE=$(curl -s -X POST https://ibam-learn-platform-staging.vercel.app/api/webhooks/systemio \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: $SIGNATURE" \
  -H "X-Webhook-Event: CONTACT_TAG_ADDED" \
  -d "$PAYLOAD" \
  -w "\n\nHTTP_STATUS: %{http_code}")

echo "$RESPONSE" | grep -v "HTTP_STATUS"
STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)

if [ "$STATUS" = " 200" ]; then
    echo "✅ Webhook processed successfully!"
    echo "📧 Check your email for welcome message from STAGING"
else
    echo "❌ Webhook failed (Status: $STATUS)"
fi
