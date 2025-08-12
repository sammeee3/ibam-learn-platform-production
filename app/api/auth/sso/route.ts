import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const source = searchParams.get('source');

    if (!email || email === '{{contact.email}}' || !email.includes('@')) {
      console.warn('❌ Invalid email parameter:', email);
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>IBAM - Access Error</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; 
                   background: #2C3E50; color: white; text-align: center; 
                   min-height: 100vh; display: flex; align-items: center; justify-content: center; }
            .container { max-width: 400px; background: rgba(255,255,255,0.1); 
                        padding: 30px; border-radius: 15px; }
            .logo { font-size: 3em; margin-bottom: 20px; }
            h2 { color: #E74C3C; margin-bottom: 15px; }
            .btn { background: #4ECDC4; color: #2C3E50; padding: 12px 20px; 
                   border-radius: 8px; text-decoration: none; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🐟</div>
            <h2>Invalid Access Link</h2>
            <p>This link appears to be invalid. Please try accessing your course from your Systeme.io member area again.</p>
            <br>
            <a href="https://ibam-learn-platform-v3.vercel.app/auth/login" class="btn">Manual Login</a>
          </div>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
        status: 400
      });
    }

    console.log(`🔑 SSO attempt for ${email} from ${source || 'unknown'}`);

    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !userProfile) {
      console.error(`❌ User not found: ${email}`);
      
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>IBAM - Account Setup Needed</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; 
                   background: #2C3E50; color: white; text-align: center; 
                   min-height: 100vh; display: flex; align-items: center; justify-content: center; }
            .container { max-width: 400px; background: rgba(255,255,255,0.1); 
                        padding: 30px; border-radius: 15px; }
            .logo { font-size: 3em; margin-bottom: 20px; }
            h2 { color: #F39C12; margin-bottom: 15px; }
            .btn { background: #4ECDC4; color: #2C3E50; padding: 15px 25px; 
                   border-radius: 8px; text-decoration: none; font-weight: bold; 
                   display: inline-block; margin: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🐟</div>
            <h2>Account Setup Required</h2>
            <p>We couldn't find your account in our learning platform. Please ensure you've completed your enrollment in Systeme.io first.</p>
            <br>
            <a href="https://ibam-learn-platform-v3.vercel.app/auth/signup?email=${encodeURIComponent(email)}" class="btn">Create Account</a>
            <a href="https://ibam-learn-platform-v3.vercel.app/auth/login?email=${encodeURIComponent(email)}" class="btn">Manual Login</a>
          </div>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
        status: 404
      });
    }

    const validTiers = ['trial', 'impact_business_startup', 'impact_business_expansion', 
                       'church_partner_small', 'church_partner_medium', 'church_partner_large'];
    
    if (!userProfile.subscription_tier || !validTiers.includes(userProfile.subscription_tier)) {
      console.warn(`❌ Invalid subscription for ${email}: ${userProfile.subscription_tier}`);
      
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>IBAM - Subscription Required</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; 
                   background: #2C3E50; color: white; text-align: center; 
                   min-height: 100vh; display: flex; align-items: center; justify-content: center; }
            .container { max-width: 400px; background: rgba(255,255,255,0.1); 
                        padding: 30px; border-radius: 15px; }
            .logo { font-size: 3em; margin-bottom: 20px; }
            h2 { color: #E74C3C; margin-bottom: 15px; }
            .btn { background: #4ECDC4; color: #2C3E50; padding: 12px 20px; 
                   border-radius: 8px; text-decoration: none; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🐟</div>
            <h2>Subscription Required</h2>
            <p>Your account needs an active subscription to access the business training. Please check your Systeme.io account or contact support.</p>
            <br>
            <a href="https://ibam-learn-platform-v3.vercel.app/auth/login" class="btn">Manual Login</a>
          </div>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
        status: 403
      });
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: '/dashboard'
      }
    });

    if (sessionError || !sessionData.properties?.action_link) {
      console.error(`❌ Failed to create session for ${email}:`, sessionError);
      
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>IBAM - Authentication Error</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; 
                   background: #2C3E50; color: white; text-align: center; 
                   min-height: 100vh; display: flex; align-items: center; justify-content: center; }
            .container { max-width: 400px; background: rgba(255,255,255,0.1); 
                        padding: 30px; border-radius: 15px; }
            .logo { font-size: 3em; margin-bottom: 20px; }
            h2 { color: #E74C3C; margin-bottom: 15px; }
            .btn { background: #4ECDC4; color: #2C3E50; padding: 12px 20px; 
                   border-radius: 8px; text-decoration: none; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🐟</div>
            <h2>Authentication Error</h2>
            <p>Unable to create your secure session. Please try manual login or contact support.</p>
            <br>
            <a href="https://ibam-learn-platform-v3.vercel.app/auth/login?email=${encodeURIComponent(email)}" class="btn">Manual Login</a>
          </div>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
        status: 500
      });
    }

    await supabase
      .from('user_profiles')
      .update({ 
        last_login_at: new Date().toISOString(),
        last_login_source: source || 'systeme_sso'
      })
      .eq('id', userProfile.id);

    console.log(`✅ SSO successful for ${email} (${userProfile.subscription_tier})`);

    const tierNames = {
      'trial': 'Free Trial',
      'impact_business_startup': 'Business Startup', 
      'impact_business_expansion': 'Business Expansion',
      'church_partner_small': 'Church Partner Small',
      'church_partner_medium': 'Church Partner Medium',
      'church_partner_large': 'Church Partner Large'
    };

    const tierDisplay = tierNames[userProfile.subscription_tier] || 'Member';

    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <title>Welcome to IBAM Business Training</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            background: linear-gradient(135deg, #2C3E50 0%, #4ECDC4 100%);
            color: white; text-align: center; height: 100vh;
            display: flex; flex-direction: column; justify-content: center;
            padding: 20px;
          }
          .container { max-width: 500px; margin: 0 auto; }
          .logo { font-size: 4em; margin-bottom: 20px; animation: pulse 2s infinite; }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
          .spinner { 
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid white; border-radius: 50%;
            width: 60px; height: 60px; animation: spin 1s linear infinite;
            margin: 30px auto;
          }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          h1 { font-size: 2.2em; margin-bottom: 15px; font-weight: 700; }
          .welcome { font-size: 1.3em; margin: 20px 0; opacity: 0.9; }
          .tier { 
            background: rgba(255,255,255,0.2); padding: 15px 30px; 
            border-radius: 25px; display: inline-block; margin: 20px 0;
            font-size: 1.1em; font-weight: 600;
          }
          .status { margin: 20px 0; font-size: 1em; opacity: 0.8; }
          .tagline {
            margin-top: 30px; font-size: 1.1em; opacity: 0.8; font-style: italic;
          }
          @media (max-width: 600px) {
            .logo { font-size: 3em; }
            h1 { font-size: 1.8em; }
            .welcome { font-size: 1.1em; }
            body { padding: 15px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🐟</div>
          <h1>Welcome to IBAM!</h1>
          <div class="welcome">Logging you into your faith-driven business training...</div>
          <div class="spinner"></div>
          <div class="tier">${tierDisplay} Access</div>
          <div class="status">Secure single sign-on in progress...</div>
          <div class="tagline">"Designed to Thrive" - Biblical principles for marketplace disciples</div>
        </div>
        
        <script>
          setTimeout(() => {
            window.location.href = '${sessionData.properties.action_link}';
          }, 2500);
          
          setTimeout(() => {
            if (window.location.href.includes('auth/sso')) {
              window.location.replace('${sessionData.properties.action_link}');
            }
          }, 5000);
        </script>
      </body>
      </html>
    `, {
      headers: { 
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('💥 Magic SSO critical error:', error);
    
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>IBAM - System Error</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; 
                 background: #2C3E50; color: white; text-align: center; 
                 min-height: 100vh; display: flex; align-items: center; justify-content: center; }
          .container { max-width: 400px; background: rgba(255,255,255,0.1); 
                      padding: 30px; border-radius: 15px; }
          .logo { font-size: 3em; margin-bottom: 20px; }
          h2 { color: #E74C3C; margin-bottom: 15px; }
          .btn { background: #4ECDC4; color: #2C3E50; padding: 12px 20px; 
                 border-radius: 8px; text-decoration: none; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🐟</div>
          <h2>System Error</h2>
          <p>Something went wrong during authentication. Our team has been notified.</p>
          <br>
          <a href="https://ibam-learn-platform-v3.vercel.app/auth/login" class="btn">Manual Login</a>
        </div>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
      status: 500
    });
  }
}