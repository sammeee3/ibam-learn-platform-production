import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Security framework test endpoint',
    timestamp: new Date().toISOString(),
    status: 'working'
  });
}