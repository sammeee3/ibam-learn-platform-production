import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabase'
import { generateUserHash } from '../../../lib/auth/jwt'

interface SystemIOWebhookPayload {
  event: 'user.created' | 'user.updated' | 'subscription.created' | 'subscription.cancelled'
  data: {
    email: string
    first_name: string
    last_name: string
    user_id: string
    subscription_status?: 'trial' | 'active' | 'expired'
    trial_end_date?: string
    course_access?: string[]
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const payload: SystemIOWebhookPayload = req.body
    const { event, data } = payload

    console.log(`System.io Webhook: ${event}`, data)

    switch (event) {
      case 'user.created':
      case 'user.updated':
        await handleUserUpdate(data)
        break
      case 'subscription.created':
        await handleSubscriptionCreated(data)
        break
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(data)
        break
      default:
        console.log(`Unhandled webhook event: ${event}`)
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
}

async function handleUserUpdate(data: SystemIOWebhookPayload['data']) {
  const userHash = generateUserHash(data.email, data.user_id)
  
  const { error } = await supabase
    .from('users')
    .upsert({
      email: data.email.toLowerCase(),
      first_name: data.first_name,
      last_name: data.last_name,
      system_io_user_id: data.user_id,
      subscription_status: data.subscription_status || 'trial',
      trial_end_date: data.trial_end_date,
      course_access: data.course_access || [],
      user_hash: userHash,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'email'
    })

  if (error) {
    throw new Error(`Failed to update user: ${error.message}`)
  }
}

async function handleSubscriptionCreated(data: SystemIOWebhookPayload['data']) {
  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'active',
      course_access: data.course_access || ['ibam-fundamentals'],
      updated_at: new Date().toISOString()
    })
    .eq('email', data.email.toLowerCase())

  if (error) {
    throw new Error(`Failed to activate subscription: ${error.message}`)
  }
}

async function handleSubscriptionCancelled(data: SystemIOWebhookPayload['data']) {
  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'expired',
      updated_at: new Date().toISOString()
    })
    .eq('email', data.email.toLowerCase())

  if (error) {
    throw new Error(`Failed to cancel subscription: ${error.message}`)
  }
}
