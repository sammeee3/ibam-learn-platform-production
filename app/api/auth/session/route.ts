import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // For now, just redirect to dashboard
  return NextResponse.redirect(new URL('/dashboard', req.url));
}