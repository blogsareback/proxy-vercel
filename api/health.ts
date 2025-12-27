// GET /health - Health check endpoint
// Returns proxy status and capabilities

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { VERSION, PROVIDER } from '../lib/config.js'
import { setCorsHeaders, handleOptions } from '../lib/cors.js'
import { validateAuth } from '../lib/auth.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleOptions(res)
  }

  setCorsHeaders(res)

  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({
      ok: false,
      error: 'Method not allowed',
    })
  }

  // Validate API key if configured
  const auth = validateAuth(req)
  if (!auth.authenticated) {
    return res.status(401).json({
      ok: false,
      error: auth.error,
    })
  }

  // Return health status with capabilities
  return res.status(200).json({
    ok: true,
    version: VERSION,
    provider: PROVIDER,
    capabilities: ['fetch', 'parse', 'discover'],
  })
}
