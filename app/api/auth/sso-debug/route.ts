import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  
  const SYSTEME_SECRET = process.env.IBAM_SYSTEME_SECRET || 'ibam-systeme-secret-2025';
  
  const debugInfo = {
    email: email,
    token: token,
    expectedToken: SYSTEME_SECRET,
    tokenMatch: token === SYSTEME_SECRET,
    hasEmail: !!email,
    environment: process.env.NODE_ENV,
    allParams: Object.fromEntries(searchParams.entries())
  };
  
  return NextResponse.json(debugInfo);
}