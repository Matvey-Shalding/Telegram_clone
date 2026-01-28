import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl

	const session = await auth.api.getSession({
		headers: request.headers
	})

	const isAuthRoute = pathname.startsWith('/auth')

	// 1️⃣ Unauthenticated → redirect to sign-up
	if (!session && !isAuthRoute) {
		return NextResponse.redirect(new URL('/auth/sign-up', request.url))
	}

	// 2️⃣ Authenticated → block auth pages
	if (session && isAuthRoute) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!api|_next|favicon.ico).*)']
}
