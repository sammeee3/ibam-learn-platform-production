#!/bin/bash

echo "🧪 Testing Production Webhook with Email"
echo "========================================="

# Full production test payload with your email
PAYLOAD='{
  "contact": {
    "id": 12345,
    "email": "sammeee@yahoo.com",
    "registeredAt": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
    "fields": [
      {"fieldName": "First name", "slug": "first_name", "value": "Jeff"},
      {"fieldName": "Surname", "slug": "surname", "value": "Test"}
    ],
    "tags": [{"id": 991808, "name": "IBAM Impact Members"}]
  },
  "tag": {"id": 991808, "name": "IBAM Impact Members"}
}'

# Production secret
SECRET="ibam-systeme-secret-2025"

# Generate signature
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" -hex | cut -d' ' -f2)

echo "Sending webhook to production..."
echo "Email will be sent to: sammeee@yahoo.com"
echo ""

# Send to production
curl -X POST https://ibam-learn-platform-v3.vercel.app/api/webhooks/systemio \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: $SIGNATURE" \
  -H "X-Webhook-Event: CONTACT_TAG_ADDED" \
  -d "$PAYLOAD" \
  -w "\n\nHTTP Status: %{http_code}\n"

echo ""
echo "✅ Check your email (sammeee@yahoo.com) for the welcome message!"
