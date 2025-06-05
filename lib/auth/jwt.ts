import jwt from 'jsonwebtoken'
import { createHash } from 'crypto'

export interface SystemIOUserData {
  email: string
  firstName: string
  lastName: string
  systemIOUserId: string
  subscriptionStatus: 'trial' | 'active' | 'expired'
  trialEndDate?: string
  courseAccess: string[]
}

export interface JWTPayload extends SystemIOUserData {
  iat: number
  exp: number
  iss: string
}

const JWT_SECRET = process.env.SYSTEM_IO_JWT_SECRET!
const EXPECTED_ISSUER = 'system.io'

export class JWTAuthError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'JWTAuthError'
  }
}

export function validateJWTToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: EXPECTED_ISSUER,
      algorithms: ['HS256']
    }) as JWTPayload

    if (!decoded.email || !decoded.firstName || !decoded.systemIOUserId) {
      throw new JWTAuthError('Missing required user data in token', 'INVALID_PAYLOAD')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(decoded.email)) {
      throw new JWTAuthError('Invalid email format', 'INVALID_EMAIL')
    }

    return decoded
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new JWTAuthError('Invalid JWT token', 'INVALID_TOKEN')
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new JWTAuthError('Token has expired', 'TOKEN_EXPIRED')
    }
    if (error instanceof JWTAuthError) {
      throw error
    }
    throw new JWTAuthError('Token validation failed', 'VALIDATION_ERROR')
  }
}

export function generateUserHash(email: string, systemIOUserId: string): string {
  return createHash('sha256')
    .update(`${email.toLowerCase()}-${systemIOUserId}`)
    .digest('hex')
    .substring(0, 16)
}
