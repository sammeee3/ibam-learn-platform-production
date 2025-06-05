import { NextRequest, NextResponse } from 'next/server'

const webhookLogs: any[] = []

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

export async function POST(request: NextRequest) {
  const timestamp = new Date().toISOString()
  
  try {
    const body = await request.text()
    const webhookData = JSON.parse(body)
    const headers = Object.fromEntries(request.headers.entries())
    
    // Extract contact and tag information
    const contact = webhookData.contact
    const tag = webhookData.tag
    const eventType = headers['x-webhook-event']
    
    console.log(`🎯 Processing ${eventType} for ${contact?.email}`)
    
    let courseAssignment = null
    
    // Handle tag added events
    if (eventType === 'CONTACT_TAG_ADDED' && tag?.name) {
      const courseConfig = TAG_TO_COURSE_MAP[tag.name]
      
      if (courseConfig) {
        courseAssignment = {
          email: contact.email,
          name: `${contact.fields?.find(f => f.slug === 'first_name')?.value || ''} ${contact.fields?.find(f => f.slug === 'surname')?.value || ''}`.trim(),
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
        name: `${contact?.fields?.find(f => f.slug === 'first_name')?.value || ''} ${contact?.fields?.find(f => f.slug === 'surname')?.value || ''}`.trim(),
        tags: contact?.tags?.map(t => t.name) || []
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
    
    // TODO: Here you would typically:
    // 1. Save to Supabase database
    // 2. Send welcome email with course access
    // 3. Create user account in learning platform
    // 4. Trigger course assignment workflow
    
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
