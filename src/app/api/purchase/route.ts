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

export async function POST(req: Request) {
  const body = await req.json()
  const { template_id, template_name, name, email, message } = body

  if (!name || !email || !template_name) {
    return NextResponse.json({ error: 'Name, email and template are required' }, { status: 400 })
  }

  const { data, error } = await supabase.from('purchase_requests').insert({
    template_id, template_name, name, email, message, status: 'pending'
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data, error } = await supabaseAdmin()
    .from('purchase_requests').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, status } = await req.json()
  const { data, error } = await supabaseAdmin().from('purchase_requests').update({ status }).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
