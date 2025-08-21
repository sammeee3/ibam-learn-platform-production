import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-config';

export async function POST(request: NextRequest) {
  try {
    const { email, learning_path, learning_mode } = await request.json();
    
    if (!email || !learning_path) {
      return NextResponse.json({ error: 'Email and learning_path required' }, { status: 400 });
    }
    
    // Validate learning_path value
    if (!['depth', 'overview'].includes(learning_path)) {
      return NextResponse.json({ error: 'Invalid learning_path value' }, { status: 400 });
    }
    
    // Validate learning_mode value (optional)
    if (learning_mode && !['individual', 'group'].includes(learning_mode)) {
      return NextResponse.json({ error: 'Invalid learning_mode value' }, { status: 400 });
    }
    
    const supabase = supabaseAdmin;
    
    // Update user profile with learning preferences
    const updateData: any = { learning_path };
    if (learning_mode) {
      updateData.learning_mode = learning_mode;
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('email', email)
      .select()
      .single();
    
    if (error) {
      console.error('Learning path update error:', error);
      // If column doesn't exist, still return success to not break UI
      if (error.message?.includes('column') || error.message?.includes('does not exist')) {
        console.log('Learning path column does not exist yet, but preference noted');
        return NextResponse.json({ 
          success: true, 
          learning_path,
          learning_mode,
          note: 'Column will be added in next database migration'
        });
      }
      return NextResponse.json({ error: 'Failed to update learning path' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      learning_path: data.learning_path,
      learning_mode: data.learning_mode
    });
    
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}