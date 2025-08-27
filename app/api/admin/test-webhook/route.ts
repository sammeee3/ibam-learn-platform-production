import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { tagName } = await request.json()
    
    // Create the payload exactly as System.io sends it
    const payload = {
      contact: {
        id: Date.now(),
        email: `test-${Date.now()}@example.com`,
        registeredAt: new Date().toISOString(),
        locale: "en",
        sourceURL: null,
        unsubscribed: false,
        bounced: false,
        needsConfirmation: false,
        fields: [
          {
            fieldName: "First name",
            slug: "first_name",
            value: "Test"
          },
          {
            fieldName: "Surname",
            slug: "surname",
            value: "User"
          }
        ],
        tags: [
          {
            id: 991808,
            name: tagName
          }
        ]
      },
      tag: {
        id: 991808,
        name: tagName
      }
    }
    
    // Generate the correct HMAC-SHA256 signature server-side
    const payloadString = JSON.stringify(payload)
    const webhookSecret = process.env.IBAM_SYSTEME_SECRET || 'staging-secret-2025-secure'
    const signature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payloadString)
      .digest('hex')
    
    // Get the webhook URL dynamically
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                    request.headers.get('origin') || 
                    'https://ibam-learn-platform-staging.vercel.app'
    
    // Call the webhook endpoint
    const response = await fetch(`${baseUrl}/api/webhooks/systemio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Event': 'CONTACT_TAG_ADDED'
      },
      body: payloadString
    })
    
    const result = await response.json()
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      result,
      testDetails: {
        email: payload.contact.email,
        tag: tagName,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Test webhook error:', error)
    return NextResponse.json({ 
      success: false,
      error: String(error) 
    }, { status: 500 })
  }
}