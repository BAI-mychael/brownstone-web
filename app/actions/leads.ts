"use server"

import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
// We map both VITE_ and NEXT_PUBLIC_ for compatibility during the migration phase
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Anon Key must be configured.')
  }
  return createClient(supabaseUrl, supabaseKey)
}

export async function submitLead(formData: FormData) {
  // 1. Check the Honeypot Field (Bot Mitigation)
  const honeypot = formData.get('fax_number')
  if (honeypot) {
    // Silently drop the bot submission to prevent them from trying again
    console.warn('[SECURITY] Bot detected and dropped via honeypot field.')
    return { success: true, message: "Request received." } // Fake success message
  }

  // 2. Extract Data
  const email = formData.get('email') as string
  const full_name = formData.get('full_name') as string
  const service_interest = formData.get('service_interest') as string
  const source = (formData.get('source') as string) || 'website_form'
  const message = formData.get('message') as string

  // Validate required fields
  if (!email || !service_interest) {
    return { success: false, error: "Missing required fields." }
  }

  // 3. Insert into Supabase
  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('leads')
      .insert([{
        email,
        full_name,
        service_interest,
        source,
        message
      }])

    if (error) {
      console.error("[SUPABASE ERROR]:", error.message)
      return { success: false, error: "Database transmission failed. Please try again." }
    }

    // 4. Trigger Notifications (Resend API)
    try {
      const resend = new Resend(process.env.RESEND_API_KEY || 're_9odV1Tsi_8a1x2NqnVDVhzKt8YJnN9XNw')
      const adminEmail = process.env.ADMIN_EMAIL || 'mychael.brown@brownstone-ai.com'
      
      // Determine Environment (DEV vs PROD) to tag the communication
      const envName = process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD'
      const envTag = `[${envName}]`

      // Determine if this is a high-priority lead (e.g. from the physical postcard or enterprise)
      const isHighPriority = source.includes('print') || source.includes('qr') || service_interest.toLowerCase().includes('enterprise') || service_interest.toLowerCase().includes('architecture')

      // A. Send Standard Email Notification to the team
      await resend.emails.send({
        from: 'Brownstone Alerts <onboarding@resend.dev>', // Resend's free testing domain
        to: adminEmail,
        subject: `${envTag} New Lead Alert: ${full_name} (${service_interest})`,
        html: `
          <h2>New Lead Captured</h2>
          <p><strong>Environment:</strong> ${envName}</p>
          <p><strong>Name:</strong> ${full_name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Interest:</strong> ${service_interest}</p>
          <p><strong>Source:</strong> ${source}</p>
          <p><strong>Message:</strong> ${message || 'N/A'}</p>
        `
      });

      // B. Send SMS Notification (Conditional Workflow)
      if (isHighPriority) {
        // We use an Email-to-SMS gateway for the text message.
        // AT&T Gateway
        const adminSmsGateway = process.env.ADMIN_SMS_GATEWAY || '2024311199@txt.att.net'
        
        await resend.emails.send({
          from: 'Brownstone Alerts <onboarding@resend.dev>',
          to: adminSmsGateway,
          subject: `${envTag} Urgent Lead`, // Subject often acts as the first line of the text
          text: `${full_name} requested ${service_interest} via ${source}. Email: ${email}` // Heavily shortened for SMS limits
        });
        console.log(`[NOTIFICATIONS] High priority lead detected. SMS and Email sent.`);
      } else {
        console.log(`[NOTIFICATIONS] Standard lead detected. Email sent.`);
      }

    } catch (notificationError) {
      // We don't want to show an error to the user if only the notification fails
      console.error("[RESEND ERROR]:", notificationError)
    }

    return { success: true, message: "Transmission complete." }
  } catch (err: any) {
    console.error("[ACTION ERROR]:", err.message)
    return { success: false, error: "Internal server error." }
  }
}
