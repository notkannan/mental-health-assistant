import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_KEY ?? ""
);

// Create a new therapy session
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { patientId } = await request.json();
    
    const { data, error } = await supabase
      .from('therapy_sessions')
      .insert({
        patient_id: patientId,
        doctor_id: session.user.id,
      })
      .select();
    
    if (error) throw error;
    
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Error creating therapy session:', error);
    return NextResponse.json(
      { error: 'Failed to create therapy session' },
      { status: 500 }
    );
  }
}

// Get all sessions for a doctor
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId');
  
  try {
    let query = supabase
      .from('therapy_sessions')
      .select(`
        *,
        patient:patients(id, name, email)
      `)
      .eq('doctor_id', session.user.id)
      .order('created_at', { ascending: false });
    
    if (patientId) {
      query = query.eq('patient_id', patientId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching therapy sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch therapy sessions' },
      { status: 500 }
    );
  }
}