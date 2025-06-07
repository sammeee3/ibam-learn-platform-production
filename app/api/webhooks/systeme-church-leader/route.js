import { createClient } from '@supabase/supabase-js';

console.log("🔥 NEW WEBHOOK FIRED - THIS IS THE RIGHT ONE!");export async function POST(req) {
  try {
    // Create Supabase client inside the function
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    console.log('=== Church Leader Webhook ===');
    console.log('SUPABASE_URL exists:', !!process.env.SUPABASE_URL);
    console.log('SUPABASE_ANON_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    
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
        business_ambassador_id: null, // Will be set after creating profile
        subscription_tier: 'starter',
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
    
    console.log('Church created successfully:', churchData.id);
    
    // Check if we need to create a profile in the profiles table
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();
    
    if (!existingProfile) {
      console.log('Creating new profile for:', email);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{
          email: email,
          full_name: fullName,
          role: 'church_leader',
          church_id: churchData.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (profileError) {
        console.error('Error creating profile:', profileError);
      } else {
        console.log('Profile created:', profileData.id);
        
        // Update church with business_ambassador_id
        await supabase
          .from('churches')
          .update({ business_ambassador_id: profileData.id })
          .eq('id', churchData.id);
      }
    } else {
      console.log('Profile already exists for:', email);
    }
    
    console.log('Church partner setup completed successfully');
    
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