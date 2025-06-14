// app/api/webhooks/test-simulation/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Test webhook data templates
const TEST_PAYLOADS = {
  impact_member: {
    event: "order.completed",
    customer: {
      id: "cust_test_impact_456",
      email: "john.impact@testuser.com",
      first_name: "John",
      last_name: "Impact"
    },
    tags: {
      primary_tier: "impact_member_v3"
    }
  },
  startup_business: {
    event: "order.completed",
    customer: {
      id: "cust_test_startup_456",
      email: "sarah.startup@testuser.com",
      first_name: "Sarah",
      last_name: "Entrepreneur"
    },
    tags: {
      primary_tier: "startup_business_v3"
    }
  }
};

export async function POST(req: NextRequest) {
  try {
    const { test_type } = await req.json();
    
    if (!test_type || !TEST_PAYLOADS[test_type as keyof typeof TEST_PAYLOADS]) {
      return NextResponse.json(
        { 
          error: 'invalid_test_type', 
          available_types: Object.keys(TEST_PAYLOADS)
        },
        { status: 400 }
      );
    }
    
    const payload = TEST_PAYLOADS[test_type as keyof typeof TEST_PAYLOADS];
    
    return NextResponse.json({
      message: 'Test webhook simulation ready',
      test_type,
      payload,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'testing_failed', message: 'Test simulation failed' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: 'IBAM Webhook Testing Utility Active',
    available_tests: Object.keys(TEST_PAYLOADS),
    timestamp: new Date().toISOString()
  });
}
