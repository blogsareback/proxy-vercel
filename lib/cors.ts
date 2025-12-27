// CORS utilities for handling cross-origin requests

import type { VercelResponse } from '@vercel/node'

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || '*'

export function getCorsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    'Access-Control-Max-Age': '86400',
  }
}

export function setCorsHeaders(res: VercelResponse): void {
  const headers = getCorsHeaders()
  for (const [key, value] of Object.entries(headers)) {
    res.setHeader(key, value)
  }
}

export function handleOptions(res: VercelResponse): void {
  setCorsHeaders(res)
  res.status(204).end()
}
