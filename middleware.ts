import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from './lib/supabase'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')!
  const pathname = request.nextUrl.pathname

  // Skip middleware for API routes and static files
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  // Check if custom domain
  if (
    !hostname.includes('localhost') &&
    !hostname.includes('127.0.0.1') &&
    !hostname.includes('vercel.app') &&
    !hostname.includes('shahojAI')
  ) {
    try {
      // Look up organization by custom domain
      const { data: org, error } = await supabaseAdmin
        .from('organizations')
        .select('id, slug')
        .eq('custom_domain', hostname)
        .single()

      if (org && !error) {
        // Store org info in request for use in pages
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-organization-id', org.id)
        requestHeaders.set('x-organization-slug', org.slug)

        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        })
      }
    } catch (error) {
      console.error('Error resolving custom domain:', error)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
