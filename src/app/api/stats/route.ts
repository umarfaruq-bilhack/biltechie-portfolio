import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin, supabase } from '@/lib/supabase'

async function isAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return false
  const { data } = await supabaseAdmin().from('admin_sessions')
    .select('id').eq('token', token).gt('expires_at', new Date().toISOString()).single()
  return !!data
}

export async function GET() {
  const admin = await isAdmin()
  const query = admin
    ? supabaseAdmin().from('stats').select('*').order('sort_order')
    : supabase.from('stats').select('*').eq('visible', true).order('sort_order')
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { data, error } = await supabaseAdmin().from('stats').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
