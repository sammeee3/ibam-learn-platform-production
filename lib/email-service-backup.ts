import nodemailer from 'nodemailer'

// Gmail SMTP configuration (temporary solution)
const gmailTransporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // your gmail address
    pass: process.env.GMAIL_APP_PASSWORD // Gmail app password (not regular password)
  }
})

export async function sendWelcomeEmailViaGmail(email: string, name: string, magicLink: string) {
  try {
    const mailOptions = {
      from: `"IBAM Training" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Welcome to IBAM Learning Platform! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .content { background: white; padding: 40px 30px; border: 1px solid #e5e5e5; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 14px 30px; background: #3B82F6; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
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
              
              <p>
                God bless,<br>
                The IBAM Team
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const result = await gmailTransporter.sendMail(mailOptions)
    return { success: true, data: { id: result.messageId } }
  } catch (error) {
    console.error('Gmail email error:', error)
    return { success: false, error }
  }
}