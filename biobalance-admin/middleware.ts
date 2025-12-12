import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // אם זה עמוד ה-login או assets סטטיים, לא צריך אימות
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/login') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // בדיקה אם המשתמש מחובר
  const authenticated = await isAuthenticated(request);

  if (!authenticated) {
    // אם לא מחובר, הפנה ל-login
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * התאם את כל הנתיבים חוץ מ:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/login|_next/static|_next/image|favicon.ico).*)',
  ],
};

