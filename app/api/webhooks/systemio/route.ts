import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const signature = request.headers.get('x-systeme-signature')
    
    console.log('🎯 System.io Webhook received:', JSON.stringify(body, null, 2))
    
    // Handle different event types
    switch (body.event_type) {
      case 'purchase.created':
        console.log(`✅ New purchase: ${body.contact?.email} bought ${body.product?.name}`)
        await createUserAccount(body.contact, body.product)
        break
        
      case 'contact.opted_in':
        console.log(`📧 New opt-in: ${body.contact?.email}`)
        await createUserAccount(body.contact, { name: 'Free Course Access' })
        break
        
      case 'contact.tag_added':
        console.log(`🏷️ Tag added to ${body.contact?.email}: ${body.tag?.name}`)
        await updateUserAccess(body.contact, body.tag)
        break
        
      case 'purchase.cancelled':
        console.log(`❌ Purchase cancelled: ${body.contact?.email}`)
        await revokeUserAccess(body.contact, body.product)
        break
        
      default:
        console.log(`🔍 Unknown event type: ${body.event_type}`)
    }
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Webhook processed successfully',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function createUserAccount(contact: any, product: any) {
  if (!contact?.email) {
    console.log('⚠️ No email provided, skipping user creation')
    return
  }
  
  const userData = {
    email: contact.email,
    firstName: contact.first_name || 'Member',
    lastName: contact.last_name || '',
    systemIOId: contact.id || contact.email,
    courseAccess: [product?.name || 'ibam-fundamentals'],
    subscriptionStatus: 'active',
    createdAt: new Date().toISOString(),
    lastLogin: null,
    progress: {}
  }
  
  console.log('👤 User data prepared:', userData)
  
  // For now, we'll log the user data
  // Later we'll connect this to your database
  console.log('🎯 User account would be created/updated in database')
  
  return userData
}

async function updateUserAccess(contact: any, tag: any) {
  console.log(`🔄 Updating access for ${contact?.email} with tag: ${tag?.name}`)
  
  // Map tags to course access levels
  const tagMapping = {
    'premium': ['ibam-fundamentals', 'advanced-strategies', 'business-planner-pro'],
    'basic': ['ibam-fundamentals'],
    'trial': ['ibam-fundamentals-preview']
  }
  
  const courseAccess = tagMapping[tag?.name?.toLowerCase()] || ['ibam-fundamentals']
  console.log(`📚 Course access updated to: ${courseAccess.join(', ')}`)
}

async function revokeUserAccess(contact: any, product: any) {
  console.log(`🚫 Revoking access for ${contact?.email} from ${product?.name}`)
  console.log('🔄 User access would be updated to remove course access')
}
