import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabase'
import { validateJWTToken, generateUserHash, JWTAuthError } from '../../../lib/auth/jwt'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { token } = req.query

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid token parameter' })
  }

  try {
    const userData = validateJWTToken(token)
    const userHash = generateUserHash(userData.email, userData.systemIOUserId)
    
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', userData.email.toLowerCase())
      .single()

    let user
    
    if (existingUser) {
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          first_name: userData.firstName,
          last_name: userData.lastName,
          system_io_user_id: userData.systemIOUserId,
          subscription_status: userData.subscriptionStatus,
          trial_end_date: userData.trialEndDate,
          course_access: userData.courseAccess,
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('email', userData.email.toLowerCase())
        .select()
        .single()

      if (updateError) {
        console.error('Error updating user:', updateError)
        return res.status(500).json({ error: 'Failed to update user data' })
      }
      
      user = updatedUser
    } else {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: userData.email.toLowerCase(),
          first_name: userData.firstName,
          last_name: userData.lastName,
          system_io_user_id: userData.systemIOUserId,
          subscription_status: userData.subscriptionStatus,
          trial_end_date: userData.trialEndDate,
          course_access: userData.courseAccess || [],
          user_hash: userHash,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating user:', createError)
        return res.status(500).json({ error: 'Failed to create user account' })
      }
      
      user = newUser
    }

    const sessionData = {
      userId: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      subscriptionStatus: user.subscription_status,
      courseAccess: user.course_access
    }

    const sessionToken = jwt.sign(sessionData, process.env.NEXTAUTH_SECRET!, {
      expiresIn: '7d',
      issuer: 'ibam.org'
    })

    res.setHeader('Set-Cookie', [
      `ibam-session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 60 * 60}`,
      `ibam-user=${user.first_name}; Secure; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 60 * 60}`
    ])

    console.log(`SSO Success: ${user.email} authenticated from System.io`)
    res.redirect(302, '/dashboard')

  } catch (error) {
    console.error('SSO Authentication Error:', error)
    
    if (error instanceof JWTAuthError) {
      return res.status(401).json({ 
        error: 'Authentication failed', 
        code: error.code,
        message: error.message 
      })
    }
    
    return res.status(500).json({ error: 'Internal server error during authentication' })
  }
}
