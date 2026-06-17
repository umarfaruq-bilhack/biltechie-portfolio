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
  const { data, error } = await supabase.from('about').select('*').limit(1).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { id, ...updates } = body
  const { data, error } = await supabaseAdmin().from('about').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
