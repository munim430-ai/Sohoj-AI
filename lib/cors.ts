/**
 * CORS handling for the public chat API consumed by the embeddable widget,
 * which runs on tenant customer domains (cross-origin).
 */
import { NextRequest, NextResponse } from 'next/server'
import { allowedWidgetOrigins } from './env'

function resolveOrigin(request: NextRequest): string | null {
  const origin = request.headers.get('origin')
  if (!origin) return null
  const allow = allowedWidgetOrigins()
  // Empty allow-list => widget embedding disabled; same-origin only.
  if (allow.length === 0) return null
  if (allow.includes('*') || allow.includes(origin)) return origin
  return null
}

export function corsHeaders(request: NextRequest): Record<string, string> {
  const origin = resolveOrigin(request)
  if (!origin) return {}
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

export function withCors(request: NextRequest, response: NextResponse): NextResponse {
  for (const [k, v] of Object.entries(corsHeaders(request))) {
    response.headers.set(k, v)
  }
  return response
}

/** Standard preflight responder. */
export function preflight(request: NextRequest): NextResponse {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) })
}
