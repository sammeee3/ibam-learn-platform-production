import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-config'
import crypto from 'crypto'

const webhookLogs: any[] = []

// Rate limiting storage
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Use secure configuration
const supabase = supabaseAdmin

// Course assignment logic based on tags
const TAG_TO_COURSE_MAP = {
  'USA Church Leader': {
    courseId: 'church-leadership-101',
    courseName: 'Church Leadership Fundamentals',
    modules: ['leadership-basics', 'biblical-leadership', 'team-building']
  },
  'IBAM Impact Members': {
    courseId: 'ibam-impact-training',
    courseName: 'IBAM Impact Member Training',
    modules: ['impact-principles', 'marketplace-ministry', 'discipleship']
  },
  'Doner': {
    courseId: 'stewardship-course',
    courseName: 'Biblical Stewardship',
    modules: ['giving-principles', 'financial-discipleship']
  },
  'Staging Work Only': {
    courseId: 'staging-access',
    courseName: 'Staging Platform Access',
    modules: ['staging-testing', 'development-environment'],
    stagingOnly: true
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'IBAM Learning Platform Webhook ACTIVE',
    status: 'processing webhooks',
    timestamp: new Date().toISOString(),
    totalProcessed: webhookLogs.length,
    recentEvents: webhookLogs.slice(-3).reverse(),
    availableCourses: Object.keys(TAG_TO_COURSE_MAP),
    note: 'Automatically assigns courses based on System.io tags'
  })
}

// Verify webhook signature for security
function verifyWebhookSignature(payload: string, signature: string | null, secret: string): boolean {
  if (!signature) {
    console.log('🚫 WEBHOOK SECURITY: No signature provided')
    return false
  }
  
  try {
    // Handle different signature formats (GitHub style, SystemIO style, etc.)
    let providedSignature = signature
    if (signature.startsWith('sha256=')) {
      providedSignature = signature.slice(7)
    } else if (signature.startsWith('sha1=')) {
      providedSignature = signature.slice(5)
    }
    
    // Calculate expected signature
    const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    
    // Secure comparison to prevent timing attacks
    const providedBuffer = Buffer.from(providedSignature, 'hex')
    const expectedBuffer = Buffer.from(expectedSignature, 'hex')
    
    if (providedBuffer.length !== expectedBuffer.length) {
      console.log('🚫 WEBHOOK SECURITY: Signature length mismatch')
      return false
    }
    
    const isValid = crypto.timingSafeEqual(providedBuffer, expectedBuffer)
    console.log(`🔐 WEBHOOK SECURITY: Signature validation ${isValid ? 'SUCCESS' : 'FAILED'}`)
    return isValid
    
  } catch (error) {
    console.error('🚫 WEBHOOK SECURITY: Signature verification error:', error)
    return false
  }
}

// Rate limiting check
function checkRateLimit(clientIP: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 10 // 10 requests per minute
  
  const clientData = rateLimitStore.get(clientIP)
  
  if (!clientData || now > clientData.resetTime) {
    // New window or expired window
    rateLimitStore.set(clientIP, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (clientData.count >= maxRequests) {
    console.log(`🚫 RATE LIMIT: Client ${clientIP} exceeded ${maxRequests} requests/minute`)
    return false
  }
  
  clientData.count++
  return true
}

// Generate secure magic token for user access
function generateMagicToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Create secure user account with magic token
async function createSecureUserAccount(courseAssignment: any) {
  const { email, name, assignedCourse } = courseAssignment
  
  try {
    console.log(`🔐 Creating secure account for: ${email}`)
    
    // Generate magic token with expiry (24 hours)
    const magicToken = generateMagicToken()
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    
    // Step 1: Check if user already exists in auth.users
    const { data: authUsers } = await supabase.auth.admin.listUsers()
    let authUser = authUsers.users.find(user => user.email === email)
    
    // Step 2: Create auth user if doesn't exist
    if (!authUser) {
      console.log(`👤 Creating auth user for: ${email}`)
      const { data: newAuthUser, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        email_confirm: true,
        user_metadata: {
          name: name,
          created_via_webhook: true,
          course: assignedCourse.courseName
        }
      })
      
      if (authError) {
        console.error(`❌ Auth user creation failed:`, authError)
        return false
      }
      
      authUser = newAuthUser.user
      console.log(`✅ Auth user created: ${authUser?.id}`)
    }
    
    // Step 3: Check if profile exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single()
    
    // Step 4: Create or update user profile with magic token
    if (!existingProfile && authUser) {
      console.log(`📋 Creating user profile for: ${email}`)
      
      const { data: newProfile, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          auth_user_id: authUser.id,
          email: email,
          first_name: name.split(' ')[0] || 'User',
          last_name: name.split(' ').slice(1).join(' ') || '',
          has_platform_access: true,
          is_active: true,
          member_type_key: 'impact_member',
          subscription_status: 'active',
          primary_role_key: 'course_student',
          location_country: 'USA',
          created_via_webhook: true,
          tier_level: 1,
          current_level: 1,
          login_count: 0,
          login_source: 'systemio',
          magic_token: magicToken,
          magic_token_expires_at: tokenExpiry.toISOString()
        })
        .select()
        .single()
      
      if (profileError) {
        console.error(`❌ Profile creation failed:`, profileError)
        return false
      }
      
      console.log(`✅ User profile created: ${newProfile?.id}`)
    } else if (existingProfile) {
      // Update existing profile with new magic token
      console.log(`🔄 Updating existing profile with new magic token: ${email}`)
      
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          has_platform_access: true,
          is_active: true,
          magic_token: magicToken,
          magic_token_expires_at: tokenExpiry.toISOString()
        })
        .eq('email', email)
      
      if (updateError) {
        console.error(`❌ Profile update failed:`, updateError)
        return false
      }
      
      console.log(`✅ Profile updated with new magic token`)
    }
    
    console.log(`🎯 Secure account setup complete for: ${email}`)
    console.log(`🔑 Magic token generated: ${magicToken.substring(0, 8)}...`)
    console.log(`⏰ Token expires: ${tokenExpiry.toISOString()}`)
    
    return true
    
  } catch (error) {
    console.error(`💥 Secure account creation failed for ${email}:`, error)
    return false
  }
}

async function handleWebhook(request: NextRequest) {
  const timestamp = new Date().toISOString()
  
  try {
    // Security validations first
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     request.headers.get('cf-connecting-ip') || 
                     'unknown'
    
    // Rate limiting check
    if (!checkRateLimit(clientIP)) {
      console.log(`🚫 WEBHOOK BLOCKED: Rate limit exceeded for ${clientIP}`)
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' }, 
        { status: 429 }
      )
    }
    
    // Get raw body for signature verification
    const body = await request.text()
    const headers = Object.fromEntries(request.headers.entries())
    
    // Verify webhook signature
    const signature = request.headers.get('x-signature') || 
                      request.headers.get('x-hub-signature-256') || 
                      request.headers.get('x-systemio-signature')
    
    const webhookSecret = process.env.IBAM_SYSTEME_SECRET
    if (!webhookSecret) {
      console.error('🚫 WEBHOOK SECURITY: Missing IBAM_SYSTEME_SECRET environment variable')
      return NextResponse.json(
        { error: 'Webhook configuration error' }, 
        { status: 500 }
      )
    }
    
    if (!verifyWebhookSignature(body, signature, webhookSecret)) {
      console.log(`🚫 WEBHOOK BLOCKED: Invalid signature from ${clientIP}`)
      return NextResponse.json(
        { error: 'Invalid webhook signature' }, 
        { status: 401 }
      )
    }
    
    console.log(`🔐 WEBHOOK SECURITY: Verified request from ${clientIP}`)
    
    // Parse webhook data after security validation
    const webhookData = JSON.parse(body)
    
    // Extract contact and tag information
    const contact = webhookData.contact
    const tag = webhookData.tag
    const eventType = headers['x-webhook-event']
    
    console.log(`🎯 Processing ${eventType} for ${contact?.email}`)
    
    let courseAssignment: any = null
    
    // Handle tag added events
    if (eventType === 'CONTACT_TAG_ADDED' && tag?.name) {
      const courseConfig = TAG_TO_COURSE_MAP[tag.name as keyof typeof TAG_TO_COURSE_MAP]
      
      if (courseConfig) {
        courseAssignment = {
          email: contact.email,
          name: `${contact.fields?.find((f: any) => f.slug === 'first_name')?.value || ''} ${contact.fields?.find((f: any) => f.slug === 'surname')?.value || ''}`.trim(),
          tag: tag.name,
          assignedCourse: courseConfig,
          assignedAt: timestamp,
          status: 'enrolled'
        }
        
        console.log(`📚 Course Assigned: ${courseConfig.courseName} to ${contact.email}`)
      }
    }
    
    // Log the event
    const logEntry = {
      timestamp,
      eventType,
      contact: {
        email: contact?.email,
        name: `${contact?.fields?.find((f: any) => f.slug === 'first_name')?.value || ''} ${contact?.fields?.find((f: any) => f.slug === 'surname')?.value || ''}`.trim(),
        tags: contact?.tags?.map((t: any) => t.name) || []
      },
      tag: tag?.name,
      courseAssignment,
      processed: true
    }
    
    webhookLogs.push(logEntry)
    
    // Keep only last 100 entries
    if (webhookLogs.length > 100) {
      webhookLogs.shift()
    }
    
    // IMPLEMENTED: Secure user account creation and magic token system
    if (courseAssignment) {
      const accountCreated = await createSecureUserAccount(courseAssignment)
      console.log(`🎯 Account creation result: ${accountCreated ? 'SUCCESS' : 'FAILED'}`)
    }
    
    return NextResponse.json({ 
      success: true, 
      processed: timestamp,
      courseAssigned: !!courseAssignment,
      message: courseAssignment ? `Enrolled in ${courseAssignment.assignedCourse.courseName}` : 'Event logged'
    }, { status: 200 })
    
  } catch (error) {
    console.error('❌ Webhook Processing Error:', error)
    
    webhookLogs.push({
      timestamp,
      error: String(error),
      success: false
    })
    
    return NextResponse.json({ 
      error: 'Processing failed',
      message: String(error)
    }, { status: 200 })
  }
}

// Export the webhook handler
export const POST = handleWebhook
