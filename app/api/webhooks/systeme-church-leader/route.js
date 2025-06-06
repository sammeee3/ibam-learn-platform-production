// IBAM Learn Platform Webhook Handler - Next.js App Router
// Receives "USA Church Leader" tag notifications from systeme.io

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Next.js App Router API Route
export async function POST(req) {

  try {
    console.log('Webhook received from systeme.io');

    // Get request body
    const body = await req.json();
    console.log('Webhook payload:', JSON.stringify(body, null, 2));
    
    // Verify webhook authenticity (optional - add webhook secret verification)
    const webhookSecret = req.headers.get('x-webhook-secret');
    if (webhookSecret !== process.env.SYSTEME_WEBHOOK_SECRET) {
      console.log('Invalid webhook secret');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract data from systeme.io webhook
    const {
      event_type,
      member_id,
      email,
      first_name,
      last_name,
      phone,
      tags,
      custom_fields
    } = body;

    // Only process if "USA Church Leader" tag was added
    if (!tags || !tags.includes('USA Church Leader')) {
      console.log('Not a USA Church Leader tag event, skipping');
      return Response.json({ message: 'Event ignored - not USA Church Leader' }, { status: 200 });
    }

    console.log(`Processing USA Church Leader signup for: ${email}`);

    // Extract church and ambassador data from custom fields
    const churchData = {
      churchName: custom_fields?.church_name || `${first_name} ${last_name}'s Church`,
      city: custom_fields?.city || '',
      state: custom_fields?.state || '',
      denomination: custom_fields?.denomination || '',
      expectedStudents: custom_fields?.expected_students || '',
      
      // Ambassador details (could be same person or different)
      ambassadorName: custom_fields?.ambassador_name || `${first_name} ${last_name}`,
      ambassadorEmail: custom_fields?.ambassador_email || email,
      ambassadorPhone: custom_fields?.ambassador_phone || phone,
      
      // Original systeme.io member details
      pastorName: `${first_name} ${last_name}`,
      pastorEmail: email,
      systemeContactId: member_id
    };

    console.log('Church data extracted:', churchData);

    // Step 1: Create or update church organization
    const { data: existingOrg, error: findError } = await supabase
      .from('organizations')
      .select('*')
      .eq('systeme_member_id', member_id)
      .single();

    let organization;

    if (existingOrg) {
      // Update existing organization
      const { data: updatedOrg, error: updateError } = await supabase
        .from('organizations')
        .update({
          name: churchData.churchName,
          city: churchData.city,
          state: churchData.state,
          denomination: churchData.denomination,
          expected_students: churchData.expectedStudents,
          membership_status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('systeme_member_id', member_id)
        .select()
        .single();

      if (updateError) throw updateError;
      organization = updatedOrg;
      console.log('Updated existing organization:', organization.id);

    } else {
      // Create new organization
      const { data: newOrg, error: createError } = await supabase
        .from('organizations')
        .insert({
          systeme_member_id: member_id,
          name: churchData.churchName,
          type: 'church',
          city: churchData.city,
          state: churchData.state,
          denomination: churchData.denomination,
          expected_students: churchData.expectedStudents,
          membership_status: 'active',
          pastor_name: churchData.pastorName,
          pastor_email: churchData.pastorEmail,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) throw createError;
      organization = newOrg;
      console.log('Created new organization:', organization.id);
    }

    // Step 2: Create or update ambassador account
    const { data: existingAmbassador, error: findAmbError } = await supabase
      .from('ambassadors')
      .select('*')
      .eq('organization_id', organization.id)
      .eq('email', churchData.ambassadorEmail)
      .single();

    let ambassador;

    if (existingAmbassador) {
      // Update existing ambassador
      const { data: updatedAmbassador, error: updateAmbError } = await supabase
        .from('ambassadors')
        .update({
          name: churchData.ambassadorName,
          phone: churchData.ambassadorPhone,
          systeme_member_email: churchData.pastorEmail,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingAmbassador.id)
        .select()
        .single();

      if (updateAmbError) throw updateAmbError;
      ambassador = updatedAmbassador;
      console.log('Updated existing ambassador:', ambassador.id);

    } else {
      // Create new ambassador
      const { data: newAmbassador, error: createAmbError } = await supabase
        .from('ambassadors')
        .insert({
          organization_id: organization.id,
          name: churchData.ambassadorName,
          email: churchData.ambassadorEmail,
          phone: churchData.ambassadorPhone,
          systeme_member_email: churchData.pastorEmail,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createAmbError) throw createAmbError;
      ambassador = newAmbassador;
      console.log('Created new ambassador:', ambassador.id);
    }

    // Step 3: Generate church invite link
    const inviteLink = generateInviteLink(organization.id, organization.name);

    // Step 4: Create or update church branding/settings
    const churchSlug = organization.name.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20);

    const { error: brandingError } = await supabase
      .from('church_settings')
      .upsert({
        organization_id: organization.id,
        church_slug: churchSlug,
        invite_link: inviteLink,
        branding: {
          primary_color: '#3B82F6', // Default blue
          church_name: organization.name,
          welcome_message: `Welcome to ${organization.name}'s Faith-Driven Business Training`,
          logo_url: null // Can be customized later
        },
        settings: {
          cohort_size_limit: parseInt(churchData.expectedStudents) || 25,
          auto_approve_students: true,
          email_notifications: true
        },
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'organization_id'
      });

    if (brandingError) throw brandingError;

    // Step 5: Send welcome email to ambassador
    const ambassadorWelcomeEmail = {
      to: ambassador.email,
      subject: `Welcome to IBAM Church Partners - ${organization.name}`,
      template: 'ambassador_welcome',
      data: {
        ambassadorName: ambassador.name,
        churchName: organization.name,
        inviteLink: inviteLink,
        loginUrl: `https://learn.ibam.org/login`,
        dashboardUrl: `https://learn.ibam.org/ambassador`,
        setupCallUrl: `https://calendly.com/ibam/ambassador-onboarding`
      }
    };

    const emailResult = await sendEmail(ambassadorWelcomeEmail);
    console.log('Ambassador welcome email sent:', emailResult);

    // Step 6: Send confirmation email to pastor (if different from ambassador)
    if (churchData.pastorEmail !== ambassador.email) {
      const pastorConfirmationEmail = {
        to: churchData.pastorEmail,
        subject: `Your Church Business Training Program is Ready - ${organization.name}`,
        template: 'pastor_confirmation',
        data: {
          pastorName: churchData.pastorName,
          churchName: organization.name,
          ambassadorName: ambassador.name,
          ambassadorEmail: ambassador.email,
          inviteLink: inviteLink,
          programOverviewUrl: `https://learn.ibam.org/church-program-overview`
        }
      };

      await sendEmail(pastorConfirmationEmail);
      console.log('Pastor confirmation email sent');
    }

    // Step 7: Prepare response data
    const responseData = {
      success: true,
      message: 'Church partner setup completed successfully',
      data: {
        organization: {
          id: organization.id,
          name: organization.name,
          church_slug: churchSlug
        },
        ambassador: {
          id: ambassador.id,
          name: ambassador.name,
          email: ambassador.email
        },
        access: {
          invite_link: inviteLink,
          dashboard_url: `https://learn.ibam.org/ambassador`,
          church_portal_url: `https://learn.ibam.org/${churchSlug}`
        },
        next_steps: [
          'Ambassador will receive welcome email with login credentials',
          'Schedule 30-minute onboarding call with IBAM team',
          'Share invite link with church members',
          'Begin Module 1 with first cohort'
        ]
      }
    };

    console.log('Church partner setup completed:', responseData);

    // Return success response
    return Response.json(responseData, { status: 200 });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    // Return error response but don't fail the webhook
    return Response.json({
      success: false,
      error: 'Internal server error processing church partner signup',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Utility function to generate church invite links
function generateInviteLink(organizationId, churchName) {
  const churchSlug = churchName.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 20);
  
  const timestamp = Date.now();
  return `https://learn.ibam.org/join/${churchSlug}-${timestamp}`;
}

// Database schema notes:
/*
Required tables for this webhook handler:

organizations (
  id uuid primary key,
  systeme_member_id text unique,
  name text,
  type text default 'church',
  city text,
  state text,
  denomination text,
  expected_students text,
  membership_status text,
  pastor_name text,
  pastor_email text,
  created_at timestamp,
  updated_at timestamp
)

ambassadors (
  id uuid primary key,
  organization_id uuid references organizations(id),
  name text,
  email text,
  phone text,
  systeme_member_email text,
  status text default 'active',
  created_at timestamp,
  updated_at timestamp
)

church_settings (
  id uuid primary key,
  organization_id uuid references organizations(id),
  church_slug text unique,
  invite_link text,
  branding jsonb,
  settings jsonb,
  created_at timestamp,
  updated_at timestamp
)
*/