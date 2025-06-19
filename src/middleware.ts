import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import {cookies} from "next/headers";

export async function middleware(request: NextRequest) {
    const jwtCookie = cookies().get('jwt_token');
    const path = request.nextUrl.pathname;

    // Define protected routes that require authentication
    const protectedRoutes = [
                         // Protects home (/)
        /^\/student-courses$/,
        /^\/dashboard$/,
        /^\/feedbacks$/,
        /^\/my-feedbacks$/,          // Protects /evaluations
        /^\/profile$/, // Protects /suppliers
        /^\/settings$/, // Protects /feedbacks
        // protect admin
        /^\/admin$/,

    ];


    const isProtectedRoute = protectedRoutes.some(route => route.test(path));

    if (isProtectedRoute && !jwtCookie) {
        console.warn(`Unauthorized access attempt to ${path}. Redirecting to login.`);
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    // Protect all /admin routes
    if (path.startsWith('/admin') && !jwtCookie) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    // Protect all /main routes
    if (path.startsWith('/main') && !jwtCookie) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    // If user is logged in and tries to access /auth, redirect based on role (if possible)
    if (path.startsWith('/auth') && jwtCookie) {
        // Optionally, you could decode the JWT here to get the role and redirect accordingly
        // For now, redirect to /dashboard (or /admin if you want to default admin users)
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
}

// Apply middleware to relevant routes
export const config = {
    matcher: ['/auth/:path*','/student-courses/:path*','/dashboard/:path*','/feedbacks/:path*','/my-feedbacks/:path*','/profiles/:path*','/settings/:path*','/admin/:path*'],
};
