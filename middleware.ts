import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { insertOrderIntoSanity } from './lib/sanity';

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user')?.value;
  const path = request.nextUrl.pathname;

  // If user is not logged in and trying to access protected routes
  if (!user && (path.startsWith('/admin') || path.startsWith('/profile'))) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // If user is logged in but trying to access admin routes without admin role
  if (user && path.startsWith('/admin')) {
    const userData = JSON.parse(user);
    if (userData.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}
// New middleware function to handle order insertion
async function handleOrderInsertion(req: NextRequest, res: NextResponse, next: () => void) {
    if (req.method === 'POST' && req.url === '/api/orders') {
        try {
            const orderData = req.body; // Assuming order data is sent in the request body
            await insertOrderIntoSanity(orderData); // Insert order into Sanity
            return new NextResponse(JSON.stringify({ message: 'Order placed successfully' }), { status: 201 });
        } catch (error) {
            return new NextResponse(JSON.stringify({ error: 'Failed to place order' }), { status: 500 });
        }
    } else {
        next(); // Pass to the next middleware
    }
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*'],
}; 