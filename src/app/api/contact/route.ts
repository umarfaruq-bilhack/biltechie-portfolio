import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'

async function isAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return false
  const { data } = await supabaseAdmin().from('admin_sessions')
    .select('id').eq('token', token).gt('expires_at', new Date().toISOString()).single()
  return !!data
}

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 })
    }

    // Save to database first — this always succeeds even if email sending fails
    const { data, error } = await supabase.from('contact_messages').insert({
      name, email, message, status: 'unread'
    }).select().single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Send email notification via Resend (non-blocking — won't fail the request if email fails)
    const resendKey = process.env.RESEND_API_KEY
    const notifyEmail = process.env.NOTIFY_EMAIL

    if (resendKey && notifyEmail) {
      try {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Biltechie Portfolio <notifications@biltechie.xyz>',
            to: notifyEmail,
            reply_to: email,
            subject: `New message from ${name}`,
            html: `
            <div style="background:#0a0a0a; padding: 40px 20px; font-family: 'Courier New', monospace;">
              <div style="max-width: 520px; margin: 0 auto; background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 12px; overflow: hidden;">

                <!-- Header with logo -->
                <div style="padding: 32px 32px 24px; border-bottom: 1px solid #1a1a1a;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding-right: 12px;">
                        <div style="width: 36px; height: 36px; border: 2px solid #00ff88; border-radius: 8px; text-align: center; line-height: 32px; color: #00ff88; font-weight: bold; font-size: 13px;">
                          BT
                        </div>
                      </td>
                      <td style="vertical-align: middle;">
                        <span style="color: #ffffff; font-size: 15px; font-weight: bold;">biltechie</span><span style="color: #00ff88; font-size: 15px; font-weight: bold;">_portfolio</span>
                      </td>
                    </tr>
                  </table>
                </div>

                <!-- Body -->
                <div style="padding: 28px 32px 8px;">
                  <div style="color: #00ff88; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                    New message received
                  </div>
                  <div style="color: #ffffff; font-size: 20px; font-weight: bold; margin-bottom: 24px;">
                    ${name} wants to connect
                  </div>

                  <div style="margin-bottom: 16px;">
                    <div style="color: rgba(255,255,255,0.3); font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">From</div>
                    <div style="color: #ffffff; font-size: 14px;">${name}</div>
                  </div>

                  <div style="margin-bottom: 20px;">
                    <div style="color: rgba(255,255,255,0.3); font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Email</div>
                    <a href="mailto:${email}" style="color: #00ff88; font-size: 14px; text-decoration: none;">${email}</a>
                  </div>

                  <div style="margin-bottom: 8px;">
                    <div style="color: rgba(255,255,255,0.3); font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Message</div>
                    <div style="background: #161616; border-left: 2px solid #00ff88; border-radius: 0 8px 8px 0; padding: 16px; color: rgba(255,255,255,0.7); font-size: 13px; line-height: 1.7;">
                      ${message}
                    </div>
                  </div>
                </div>

                <!-- CTA -->
                <div style="padding: 8px 32px 28px;">
                  <a href="mailto:${email}?subject=Re: your message&body=Hi ${name},%0A%0A"
                     style="display: inline-block; background: #00ff88; color: #0a0a0a; font-size: 13px; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin-top: 8px;">
                    Reply to ${name}
                  </a>
                </div>

                <!-- Footer -->
                <div style="padding: 16px 32px; border-top: 1px solid #1a1a1a; background: #0a0a0a;">
                  <div style="color: rgba(255,255,255,0.2); font-size: 11px;">
                    Sent via <a href="https://biltechie.xyz" style="color: rgba(0,255,136,0.5); text-decoration: none;">biltechie.xyz</a> contact form
                  </div>
                </div>

              </div>
            </div>
            `,
          }),
        })
        if (!emailRes.ok) {
          const errBody = await emailRes.text()
          console.error('Resend API error:', emailRes.status, errBody)
        }
      } catch (emailError) {
        console.error('Email notification failed:', emailError)
      }
    } else {
      console.warn('Resend not configured — skipping email. resendKey present:', !!resendKey, 'notifyEmail present:', !!notifyEmail)
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('Contact route crashed:', err)
    return NextResponse.json({ error: 'Internal server error', detail: String(err) }, { status: 500 })
  }
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data, error } = await supabaseAdmin()
    .from('contact_messages').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, status } = await req.json()
  const { data, error } = await supabaseAdmin().from('contact_messages').update({ status }).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
