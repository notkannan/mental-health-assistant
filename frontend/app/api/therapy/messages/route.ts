import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { createClient } from '@supabase/supabase-js';

// Add proper error handling for missing environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
}

// Initialize Supabase client only if environment variables are available
const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function POST(request: Request) {
  // Add check to handle null supabase client
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database connection not available' },
      { status: 500 }
    );
  }

  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { sessionId, content, senderType, aiCategory } = await request.json();
    
    const { data: sessionData, error: sessionError } = await supabase
      .from('therapy_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('doctor_id', session.user.id)
      .single();
    
    if (sessionError || !sessionData) {
      return NextResponse.json(
        { error: 'Session not found or access denied' },
        { status: 403 }
      );
    }
    
    const { data, error } = await supabase
      .from('therapy_messages')
      .insert({
        session_id: sessionId,
        content,
        sender_type: senderType,
        ai_category: aiCategory || null,
      })
      .select();
    
    if (error) throw error;
    
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Error adding therapy message:', error);
    return NextResponse.json(
      { error: 'Failed to add therapy message' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // Add check to handle null supabase client
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database connection not available' },
      { status: 500 }
    );
  }

  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  
  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const { data: sessionData, error: sessionError } = await supabase
      .from('therapy_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('doctor_id', session.user.id)
      .single();
    
    if (sessionError || !sessionData) {
      return NextResponse.json(
        { error: 'Session not found or access denied' },
        { status: 403 }
      );
    }
    
    const { data, error } = await supabase
      .from('therapy_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching therapy messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch therapy messages' },
      { status: 500 }
    );
  }
}