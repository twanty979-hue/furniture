'use server'

import { createClient } from '@/supabase/server'

export type FurnitureContactFormData = {
  name: string
  email: string
  phone?: string
  message: string
}

export async function submitFurnitureContact(data: FurnitureContactFormData) {
  try {
    if (!data.name?.trim()) {
      return { success: false, error: 'Please enter your name.' }
    }
    if (!data.email?.trim() && !data.phone?.trim()) {
      return { success: false, error: 'Please provide either an email or phone number.' }
    }

    const nameParts = data.name.trim().split(/\s+/)
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || '-'

    const supabase = await createClient()

    // 1. Insert inquiry into public.contact_inquiries
    const { error: insertError } = await supabase
      .from('contact_inquiries')
      .insert({
        first_name: firstName,
        last_name: lastName,
        phone: data.phone?.trim() || '',
        email: data.email.trim(),
        message: data.message?.trim() || '',
        source: 'furniture',
        status: 'new',
      })

    if (insertError) {
      console.error('Failed to insert contact inquiry for Furniture:', insertError)
      return { success: false, error: 'Unable to submit your inquiry. Please try again.' }
    }

    // 2. Notify ONLY Admins
    try {
      const { data: adminUsers } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'admin')
        .eq('status', 'active')

      if (adminUsers && adminUsers.length > 0) {
        const notifRows = adminUsers.map((admin: any) => ({
          user_id: admin.id,
          title: '📩 มีลูกค้าติดต่อใหม่จากเว็บ FURNITURE (Ember & Ash)',
          body: `คุณ ${data.name.trim()} (${data.phone?.trim() || data.email.trim()}): ${
            data.message?.trim() ? data.message.trim().slice(0, 80) : 'สนใจเฟอร์นิเจอร์คัสตอมสั่งทำ'
          }`,
          type: 'inquiry',
          is_read: false,
        }))
        await supabase.from('notifications').insert(notifRows)
      }
    } catch (notifErr) {
      console.error('Error dispatching admin notifications for Furniture:', notifErr)
    }

    return { success: true }
  } catch (err: any) {
    console.error('Unexpected error in submitFurnitureContact:', err)
    return { success: false, error: 'Network error. Please try again later.' }
  }
}
