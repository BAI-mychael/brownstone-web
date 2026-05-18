import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  // 1. Handle preflight CORS requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  try {
    const payload = await req.json()
    const { record, type } = payload

    // Only process new lead insertions
    if (type !== 'INSERT' || !record) {
      return new Response(JSON.stringify({ message: 'Ignored non-INSERT trigger.' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const { email, full_name, service_interest, source, message } = record

    // Format a high-fidelity plain text and HTML layout for dev-ops
    const emailSubject = `🚨 New Lead/Incident: [${service_interest.toUpperCase()}] from ${full_name || email}`
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-top: 4px solid #B87333;">
        <h2 style="color: #1A1A1A; margin-top: 0; font-size: 20px; text-transform: uppercase; tracking: 1px;">
          BROWNSTONE TELEMETRY ALERT
        </h2>
        <p style="font-size: 14px; color: #555;">
          A new interactive event occurred on the live website. Real-time details below:
        </p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; font-weight: bold; width: 140px; border-bottom: 1px solid #eeeeee;">Source Portal</td>
            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-mono;">${source || 'Direct Site'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eeeeee;">Contact Name</td>
            <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${full_name || 'N/A'}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eeeeee;">Corporate Email</td>
            <td style="padding: 10px; border-bottom: 1px solid #eeeeee;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eeeeee;">Service Track</td>
            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #B87333; text-transform: uppercase;">${service_interest}</td>
          </tr>
        </table>
        
        ${message ? `
          <div style="background-color: #FAF9F6; border-left: 3px solid #808080; padding: 15px; margin-top: 20px; font-family: monospace; font-size: 12px; white-space: pre-wrap; color: #333;">
            <strong>TELEMETRY SYMPTOM LOG / NOTES:</strong><br/><br/>${message}
          </div>
        ` : ''}
        
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 30px 0;" />
        <p style="font-size: 11px; color: #888; text-align: center;">
          Sent automatically via Supabase Edge Trigger • Brownstone AI Security Framework
        </p>
      </div>
    `

    // 2. Call the Resend API to dispatch email to dev-ops
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Brownstone Telemetry <alerts@brownstone-ai.com>', // Set up a verified domain in Resend, or use 'onboarding@resend.dev' for testing
        to: 'dev-ops@brownstone-ai.com',
        subject: emailSubject,
        html: emailHtml,
      }),
    })

    const resendData = await resendResponse.json()

    if (!resendResponse.ok) {
      throw new Error(`Resend API returned error: ${JSON.stringify(resendData)}`)
    }

    return new Response(JSON.stringify({ success: true, data: resendData }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
