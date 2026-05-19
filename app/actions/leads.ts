"use server"

import { createClient } from '@supabase/supabase-js'

// We map both VITE_ and NEXT_PUBLIC_ for compatibility during the migration phase
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Server-side Supabase client initialization
const supabase = createClient(supabaseUrl, supabaseKey)

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

    return { success: true, message: "Transmission complete." }
  } catch (err: any) {
    console.error("[ACTION ERROR]:", err.message)
    return { success: false, error: "Internal server error." }
  }
}
