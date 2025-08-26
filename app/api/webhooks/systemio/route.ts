import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-config'
import { MEMBERSHIP_CONFIG, MembershipUtils } from '@/lib/membership-config'
import { addWebhookLog } from '@/lib/webhook-logger'
import { sendWelcomeEmail } from '@/lib/email-service'
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

// Enhanced user account creation with membership tier support
async function createSecureUserAccount(courseAssignment: any) {
  const { email, name, assignedCourse, membershipTier, tagName } = courseAssignment
  
  try {
    console.log(`🔐 Creating secure account for: ${email}`)
    
    // Generate magic token with expiry (7 days)
    const magicToken = generateMagicToken()
    const tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    
    // Step 1: Check if user already exists in auth.users
    const { data: authUsers } = await supabase.auth.admin.listUsers()
    let authUser = authUsers?.users?.find((user: any) => user.email === email)
    
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
      
      // Create profile with membership tier information
      const profileData = {
        auth_user_id: authUser.id,
        email: email,
        first_name: name.split(' ')[0] || 'User',
        last_name: name.split(' ').slice(1).join(' ') || '',
        has_platform_access: true,
        is_active: true,
        created_via_webhook: true,
        login_source: 'systemio',
        magic_token: magicToken,
        magic_token_expires_at: tokenExpiry.toISOString(),
        // Add membership information
        membership_level: membershipTier?.key || 'trial',
        membership_features: membershipTier?.features || {},
        trial_ends_at: membershipTier ? MembershipUtils.getTrialEndDate(membershipTier.key).toISOString() : null,
        auto_renew: true, // Default to auto-renewal
        subscription_status: 'trial' // Start as trial, System.io will update when paid
      }
      
      // Add optional fields if they exist in the table
      try {
        // Try to add advanced fields, ignore if they don't exist
        Object.assign(profileData, {
          member_type_key: 'impact_member',
          subscription_status: 'active',
          primary_role_key: 'course_student',
          location_country: 'USA',
          tier_level: 1,
          current_level: 1,
          login_count: 0
        })
      } catch (e) {
        console.log('🔄 Using basic profile fields for staging compatibility')
      }

      const { data: newProfile, error: profileError } = await supabase
        .from('user_profiles')
        .insert(profileData)
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
    
    // Send welcome email with magic link
    const magicLinkUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://ibam-learn-platform-staging-v2.vercel.app'}/auth/magic-login?token=${magicToken}&email=${encodeURIComponent(email)}`
    
    try {
      const emailResult = await sendWelcomeEmail(email, name, magicLinkUrl)
      if (emailResult.success) {
        console.log(`📧 Welcome email sent to: ${email}`)
      } else {
        console.error(`📧 Failed to send welcome email:`, emailResult.error)
        // Don't fail the whole process if email fails - user can still login
      }
    } catch (emailError) {
      console.error(`📧 Email service error:`, emailError)
      // Continue - email is not critical for account creation
    }
    
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
    
    // Verify webhook signature - System.io uses X-Webhook-Signature header
    const signature = request.headers.get('x-webhook-signature') || 
                      request.headers.get('x-signature') || 
                      request.headers.get('x-hub-signature-256')
    
    const webhookSecret = process.env.IBAM_SYSTEME_SECRET
    if (!webhookSecret) {
      console.error('🚫 WEBHOOK SECURITY: Missing IBAM_SYSTEME_SECRET environment variable')
      return NextResponse.json(
        { error: 'Webhook configuration error' }, 
        { status: 500 }
      )
    }
    
    // 🔒 SECURITY: Webhook signature verification (PRODUCTION READY)
    console.log(`🔐 WEBHOOK SECURITY: Verifying signature from ${clientIP}`)
    console.log(`📝 Received signature: ${signature ? 'Present' : 'Missing'}`)
    
    // Verify webhook signature - System.io uses HMAC-SHA256 hex format
    if (!verifyWebhookSignature(body, signature, webhookSecret)) {
      console.log(`🚫 WEBHOOK BLOCKED: Invalid signature from ${clientIP}`)
      console.log(`Expected header: X-Webhook-Signature`)
      console.log(`Received headers:`, Object.keys(headers).filter(h => h.toLowerCase().includes('signature')))
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
    
    // Handle tag added events with membership tier support
    if (eventType === 'CONTACT_TAG_ADDED' && tag?.name) {
      // First check if this is a membership tag
      const membershipTier = MembershipUtils.getTierByTag(tag.name)
      
      if (membershipTier) {
        // This is a membership tag - process membership
        courseAssignment = {
          email: contact.email,
          name: `${contact.fields?.find((f: any) => f.slug === 'first_name')?.value || ''} ${contact.fields?.find((f: any) => f.slug === 'surname')?.value || ''}`.trim(),
          tag: tag.name,
          tagName: tag.name,
          membershipTier: membershipTier,
          assignedCourse: {
            courseId: 'ibam-course',
            courseName: 'IBAM Business Course',
            modules: ['all'] // Access controlled by membership features
          },
          assignedAt: timestamp,
          status: 'enrolled'
        }
        
        console.log(`💎 Membership Assigned: ${membershipTier.name} to ${contact.email}`)
        console.log(`💰 Pricing: $${membershipTier.monthlyPrice}/mo or $${membershipTier.annualPrice}/yr`)
        console.log(`⏰ Trial Period: ${membershipTier.trialDays} days`)
      } else {
        // Check legacy course mapping for backward compatibility
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
    }
    
    // Handle tag removed events (for membership cancellations)
    if (eventType === 'CONTACT_TAG_REMOVED' && tag?.name) {
      const membershipTier = MembershipUtils.getTierByTag(tag.name)
      
      if (membershipTier) {
        console.log(`🚫 Membership Removed: ${membershipTier.name} from ${contact?.email}`)
        
        // Update user profile to reflect cancellation
        await supabase
          .from('user_profiles')
          .update({
            auto_renew: false,
            subscription_status: 'cancelled',
            cancelled_at: new Date().toISOString()
          })
          .eq('email', contact.email)
      }
    }
    
    // Log the event to webhook monitor
    const membershipDetected = courseAssignment?.membershipTier?.name || null
    const userCreated = !!courseAssignment
    
    const logEntry = {
      timestamp,
      event_type: eventType || webhookData.event_type || 'UNKNOWN',
      contact: {
        email: contact?.email,
        name: `${contact?.fields?.find((f: any) => f.slug === 'first_name')?.value || ''} ${contact?.fields?.find((f: any) => f.slug === 'surname')?.value || ''}`.trim(),
        tags: contact?.tags?.map((t: any) => t.name) || []
      },
      tag: tag?.name,
      tags: contact?.tags?.map((t: any) => t.name) || [],
      membership_detected: membershipDetected,
      user_created: userCreated,
      courseAssignment,
      processed: true,
      raw_data: webhookData
    }
    
    // Log to webhook monitor
    await addWebhookLog(logEntry)
    
    // Also keep local log
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
    
    // Log error to webhook monitor
    await addWebhookLog({
      timestamp,
      event_type: 'ERROR',
      email: 'N/A',
      tags: [],
      membership_detected: null,
      user_created: false,
      error: String(error),
      success: false,
      raw_data: { error: String(error) }
    })
    
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
