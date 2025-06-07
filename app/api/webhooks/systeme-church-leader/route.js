import { createClient } from '@supabase/supabase-js';

export async function POST(req) {
  try {
    console.log('=== DEBUG: Environment Variables ===');
    console.log('SUPABASE_URL exists:', !!process.env.SUPABASE_URL);
    console.log('SUPABASE_ANON_KEY exists:', !!process.env.SUPABASE_ANON_KEY);
    console.log('SUPABASE_URL value:', process.env.SUPABASE_URL ? 'SET' : 'NOT SET');
    console.log('SUPABASE_ANON_KEY value:', process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
    
    // List all env vars that start with SUPABASE
    const supabaseEnvs = Object.keys(process.env).filter(key => key.startsWith('SUPABASE'));
    console.log('All SUPABASE env vars:', supabaseEnvs);
    
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return Response.json({ 
        error: 'Missing Supabase environment variables',
        debug: {
          supabaseUrl: !!process.env.SUPABASE_URL,
          supabaseAnonKey: !!process.env.SUPABASE_ANON_KEY,
          allSupabaseVars: supabaseEnvs
        }
      }, { status: 500 });
    }
    
    // Create Supabase client inside the function
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    console.log('Supabase client created successfully');
    
    console.log('Webhook received from systeme.io');
    
    // Parse the incoming webhook data
    const body = await req.json();
    console.log('Webhook body:', JSON.stringify(body, null, 2));
    
    // Extract contact and tag data
    const { contact, tag } = body;
    
    // Verify this is for the USA Church Leader tag
    if (tag?.name !== 'USA Church Leader') {
      console.log('Not a USA Church Leader tag, ignoring');
      return Response.json({ message: 'Tag not relevant' }, { status: 200 });
    }
    
    console.log('Processing USA Church Leader tag for:', contact?.email);
    
    // Extract contact information
    const email = contact?.email;
    if (!email) {
      console.log('No email found in contact data');
      return Response.json({ error: 'No email found' }, { status: 400 });
    }
    
    // Get name from fields
    const firstName = contact?.fields?.find(f => f.slug === 'first_name')?.value || '';
    const lastName = contact?.fields?.find(f => f.slug === 'last_name')?.value || '';
    const fullName = `${firstName} ${lastName}`.trim() || email;
    
    // Get country from fields
    const country = contact?.fields?.find(f => f.slug === 'country')?.value || 'US';
    
    console.log('Contact details:', { email, fullName, country });
    
    // Create church organization
    const churchName = `${fullName}'s Church`;
    const slug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    console.log('Creating church organization:', churchName);
    
    // Insert organization
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert([{
        name: churchName,
        slug: slug,
        type: 'church',
        country: country,
        status: 'active',
        created_at: new Date().toISOString(),
        metadata: {
          source: 'systeme_io_webhook',
          contact_id: contact?.id,
          tag_applied: tag?.name,
          original_email: email
        }
      }])
      .select()
      .single();
    
    if (orgError) {
      console.error('Error creating organization:', orgError);
      return Response.json({ error: 'Failed to create organization' }, { status: 500 });
    }
    
    console.log('Organization created:', orgData.id);
    
    // Create ambassador account
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{
        email: email,
        name: fullName,
        role: 'ambassador',
        organization_id: orgData.id,
        status: 'invited',
        created_at: new Date().toISOString(),
        metadata: {
          source: 'systeme_io_webhook',
          contact_id: contact?.id
        }
      }])
      .select()
      .single();
    
    if (userError) {
      console.error('Error creating user:', userError);
      return Response.json({ error: 'Failed to create user' }, { status: 500 });
    }
    
    console.log('Ambassador account created:', userData.id);
    
    // Generate invite link
    const inviteToken = crypto.randomUUID();
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${inviteToken}`;
    
    // Store invite token
    const { error: inviteError } = await supabase
      .from('user_invites')
      .insert([{
        token: inviteToken,
        user_id: userData.id,
        organization_id: orgData.id,
        invited_by: 'system',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        created_at: new Date().toISOString()
      }]);
    
    if (inviteError) {
      console.error('Error creating invite:', inviteError);
    }
    
    console.log('Church partner setup completed successfully');
    console.log('Invite link:', inviteLink);
    
    return Response.json({
      success: true,
      message: 'Church partner setup completed',
      data: {
        organization: {
          id: orgData.id,
          name: orgData.name,
          slug: orgData.slug
        },
        ambassador: {
          id: userData.id,
          email: userData.email,
          name: userData.name
        },
        inviteLink: inviteLink
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}