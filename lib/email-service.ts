import { Resend } from 'resend'

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Email configuration
const FROM_EMAIL = process.env.EMAIL_FROM || 'IBAM Learning Platform <noreply@ibam-learn.com>'
const REPLY_TO = process.env.EMAIL_REPLY_TO || 'support@ibam-learn.com'

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, text, replyTo }: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML if no text provided
      reply_to: replyTo || REPLY_TO,
    })

    if (error) {
      console.error('❌ Email send error:', error)
      return { success: false, error }
    }

    console.log('✅ Email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('❌ Email service error:', error)
    return { success: false, error }
  }
}

// Send welcome email with magic link
export async function sendWelcomeEmail(email: string, name: string, magicLink: string) {
  const subject = 'Welcome to IBAM Learning Platform! 🎉'
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .content { background: white; padding: 40px 30px; border: 1px solid #e5e5e5; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 14px 30px; background: #3B82F6; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .button:hover { background: #2563EB; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .link { color: #3B82F6; word-break: break-all; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to IBAM Learning Platform! 🎉</h1>
        </div>
        <div class="content">
          <h2>Hello ${name}!</h2>
          <p>Thank you for joining the IBAM Learning Platform. Your account has been created successfully.</p>
          
          <p><strong>Your membership includes:</strong></p>
          <ul>
            <li>✅ Full access to all course modules</li>
            <li>✅ Interactive business planning tools</li>
            <li>✅ Progress tracking and certificates</li>
            <li>✅ 7-day free trial period</li>
          </ul>
          
          <p>Click the button below to access your account:</p>
          
          <div style="text-align: center;">
            <a href="${magicLink}" class="button">Access Your Account</a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Or copy and paste this link into your browser:<br>
            <span class="link">${magicLink}</span>
          </p>
          
          <p style="margin-top: 30px;">
            <strong>Important:</strong> This link expires in 24 hours for security reasons. 
            If it expires, simply request a new one from the login page.
          </p>
          
          <p>
            If you have any questions, feel free to reply to this email or contact our support team.
          </p>
          
          <p>
            God bless,<br>
            The IBAM Team
          </p>
        </div>
        <div class="footer">
          <p>IBAM Learning Platform - Empowering Entrepreneurs Worldwide</p>
          <p>100% of membership fees fund entrepreneurs in remote areas</p>
        </div>
      </div>
    </body>
    </html>
  `
  
  return sendEmail({
    to: email,
    subject,
    html,
  })
}

// Send membership update email
export async function sendMembershipUpdateEmail(email: string, name: string, tierName: string, action: 'upgraded' | 'downgraded' | 'cancelled') {
  const subject = action === 'cancelled' 
    ? 'Your IBAM Membership Has Been Cancelled'
    : `Your IBAM Membership Has Been ${action === 'upgraded' ? 'Upgraded' : 'Downgraded'}`
  
  const actionMessage = {
    upgraded: `Great news! Your membership has been upgraded to <strong>${tierName}</strong>.`,
    downgraded: `Your membership has been changed to <strong>${tierName}</strong>.`,
    cancelled: `Your membership has been cancelled. We're sorry to see you go.`
  }
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 22px; }
        .content { background: white; padding: 30px; border: 1px solid #e5e5e5; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Membership Update</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>${actionMessage[action]}</p>
          
          ${action !== 'cancelled' ? `
            <p>Your updated membership includes:</p>
            <ul>
              <li>All features of the ${tierName} tier</li>
              <li>Continued access to your progress and saved work</li>
            </ul>
          ` : `
            <p>Your access will continue until the end of your current billing period. 
            All your progress and data will be saved if you decide to rejoin.</p>
          `}
          
          <p>If you have any questions about this change, please don't hesitate to contact us.</p>
          
          <p>
            God bless,<br>
            The IBAM Team
          </p>
        </div>
        <div class="footer">
          <p>IBAM Learning Platform</p>
        </div>
      </div>
    </body>
    </html>
  `
  
  return sendEmail({
    to: email,
    subject,
    html,
  })
}