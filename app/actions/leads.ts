"use server"

import { createClient } from '@supabase/supabase-js'

const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Service Role Key must be configured.')
  }
  return createClient(supabaseUrl, supabaseKey)
}

// Edge-compatible Resend helper using native fetch
async function sendEmail({
  from,
  to,
  subject,
  html,
  text
}: {
  from: string
  to: string | string[]
  subject: string
  html?: string
  text?: string
}) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    console.warn('[RESEND] No API key configured, skipping email.')
    return { success: false, error: 'No API key' }
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text
    })
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[RESEND ERROR]:', err)
    throw new Error(`Resend API error: ${err}`)
  }

  return res.json()
}

export async function submitLead(formData: FormData) {
  // 1. Honeypot check
  const honeypot = formData.get('fax_number')
  if (honeypot) {
    console.warn('[SECURITY] Bot detected via honeypot.')
    return { success: true, message: "Request received." }
  }

  // 2. Extract data
  const email = formData.get('email') as string
  const full_name = formData.get('full_name') as string
  const service_interest = formData.get('service_interest') as string
  const source = (formData.get('source') as string) || 'website_form'
  const message = formData.get('message') as string

  if (!email || !service_interest) {
    return { success: false, error: "Missing required fields." }
  }

  // 3. Insert into Supabase
  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('leads')
      .insert([{ email, full_name, service_interest, source, message }])

    if (error) {
      console.error("[SUPABASE ERROR]:", error.message)
      return { success: false, error: "Database transmission failed." }
    }

    // 4. Send notifications
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'mychael.brown@brownstone-ai.com'
      const envName = process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD'
      const envTag = `[${envName}]`

      const isHighPriority = source.includes('print') || source.includes('qr') ||
        service_interest.toLowerCase().includes('enterprise') ||
        service_interest.toLowerCase().includes('architecture')

      // Email notification
      await sendEmail({
        from: 'Brownstone Alerts <onboarding@resend.dev>',
        to: adminEmail,
        subject: `${envTag} New Lead: ${full_name} (${service_interest})`,
        html: `
          <h2>New Lead Captured</h2>
          <p><strong>Environment:</strong> ${envName}</p>
          <p><strong>Name:</strong> ${full_name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Interest:</strong> ${service_interest}</p>
          <p><strong>Source:</strong> ${source}</p>
          <p><strong>Message:</strong> ${message || 'N/A'}</p>
        `
      })

      // SMS for high priority
      if (isHighPriority) {
        const adminSmsGateway = process.env.ADMIN_SMS_GATEWAY || '2024311199@txt.att.net'
        await sendEmail({
          from: 'Brownstone Alerts <onboarding@resend.dev>',
          to: adminSmsGateway,
          subject: `${envTag} Urgent Lead`,
          text: `${full_name} requested ${service_interest} via ${source}. Email: ${email}`
        })
        console.log('[NOTIFICATIONS] High priority: SMS + Email sent.')
      } else {
        console.log('[NOTIFICATIONS] Standard: Email sent.')
      }

    } catch (notificationError) {
      console.error("[RESEND ERROR]:", notificationError)
    }

    return { success: true, message: "Transmission complete." }
  } catch (err: any) {
    console.error("[ACTION ERROR]:", err.message)
    return { success: false, error: "Internal server error." }
  }
}
