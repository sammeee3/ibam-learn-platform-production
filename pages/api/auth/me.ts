import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const sessionToken = req.cookies['ibam-session']
    
    if (!sessionToken) {
      return res.status(401).json({ error: 'No session found' })
    }

    const decoded = jwt.verify(sessionToken, process.env.NEXTAUTH_SECRET!)
    res.json(decoded)
  } catch (error) {
    res.status(401).json({ error: 'Invalid session' })
  }
}
