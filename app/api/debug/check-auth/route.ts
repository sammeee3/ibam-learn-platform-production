import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-config'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    // Check server-side auth
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user }, error } = await supabase.auth.getUser()
    
    // Also check admin view
    const { data: allUsers } = await supabaseAdmin.auth.admin.listUsers()
    const sammeeUser = allUsers?.users?.find(u => u.email === 'sammeee@yahoo.com')
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      server_auth_check: {
        user_found: !!user,
        user_id: user?.id,
        user_email: user?.email,
        error: error?.message
      },
      sammeee_account: {
        exists: !!sammeeUser,
        auth_id: sammeeUser?.id,
        email: sammeeUser?.email,
        confirmed: !!sammeeUser?.email_confirmed_at
      },
      cookies_present: {
        has_cookies: cookies().toString().includes('supabase') || cookies().toString().includes('ibam_auth'),
        cookie_count: cookies().getAll().length,
        auth_cookies: cookies().getAll().filter(c => 
          c.name.includes('supabase') || 
          c.name.includes('auth') ||
          c.name.includes('ibam')
        ).map(c => ({ name: c.name, has_value: !!c.value }))
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      error: 'Auth check failed',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}