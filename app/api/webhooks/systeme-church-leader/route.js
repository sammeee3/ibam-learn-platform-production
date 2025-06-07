import { createClient } from '@supabase/supabase-js';

export async function POST(req) {
  try {
    console.log('🚀 CHURCH WEBHOOK FIRED AT', new Date());
    
    // TEMPORARY HARDCODED VALUES - YOUR ACTUAL VALUES
    const SUPABASE_URL = 'https://tutrnikhomrgcpkzszvq.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODk0MTksImV4cCI6MjA2NDU2NTQxOX0.-TI2kjnGM27QYM0BfBSogGf8A17VRxNlydoRYmnGmn8';
    
    // Create Supabase client with hardcoded values
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    console.log('=== Church Leader Webhook ===');
    console.log('Supabase client created with hardcoded values');
    
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
    
    // Create church record
    const churchName = `${fullName}'s Church`;
    
    console.log('Creating church:', churchName);
    
    // Insert into churches table (using existing structure)
    const { data: churchData, error: churchError } = await supabase
      .from('churches')
      .insert([{
        name: churchName,
        location: country,
        website: null,
        pastor_name: fullName,
        business_ambassador_id: null,
        subscription_tier: 'church_small',
        max_students: 50,
        current_students: 0,
        vision_statement: 'To multiply disciples in our local community',
        mission_statement: 'Transforming lives through marketplace ministry',
        local_market_info: `Church serving the ${country} market`,
        custom_branding: {
          source: 'systeme_io_webhook',
          contact_id: contact?.id,
          tag_applied: tag?.name,
          original_email: email,
          setup_date: new Date().toISOString()
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (churchError) {
      console.error('Error creating church:', churchError);
      return Response.json({ error: 'Failed to create church', details: churchError.message }, { status: 500 });
    }
    
    console.log('🎉 Church created successfully:', churchData.id);
    console.log('Church name:', churchData.name);
    
    return Response.json({
      success: true,
      message: 'Church partner setup completed',
      data: {
        church: {
          id: churchData.id,
          name: churchData.name,
          pastor_name: churchData.pastor_name
        },
        email: email,
        setupComplete: true
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