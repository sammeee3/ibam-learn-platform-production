import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasSystemIOSecret: !!process.env.SYSTEM_IO_JWT_SECRET,
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(key => 
      key.includes('NEXTAUTH') || key.includes('SYSTEM')
    )
  })
}
