import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const supabase = createClient();
  
  try {
    const { data: session, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;

    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const supabase = createClient();
  const updates = await request.json();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user?.email !== 'jsamuelson@ibam.org') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('sessions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}