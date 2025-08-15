import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server';
// import { get } from '@vercel/edge-config';
import { NextResponse } from 'next/server';

const isPublic = createRouteMatcher([
  '/sign-in(.*)', '/sign-up(.*)', '/sign-out(.*)', '/api/redeem-code(.*)', '/api/delete-account(.*)', '/api/init-user(.*)', '/api/email-opt-in(.*)',
  '/_next/static/(.*)', '/_next/image/(.*)', '/favicon.ico', '/robots.txt',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublic(req)) return;

  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn({ returnBackUrl: req.url });

  // Persistent approval stored in Clerk metadata
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const approved = Boolean((user.privateMetadata as Record<string, unknown> | undefined)?.approved);

  const url = new URL(req.url);
  const pathname = url.pathname;
  const isEnterCode = pathname === '/enter-code' || pathname.startsWith('/enter-code/');

  // If not approved: allow only enter-code, otherwise redirect to enter-code
  if (!approved) {
    if (isEnterCode) return NextResponse.next();
    const redirectUrl = new URL('/enter-code', req.url);
    redirectUrl.searchParams.set('next', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If approved: block access to enter-code and send to intended or home
  if (isEnterCode) {
    const nextParam = url.searchParams.get('next') || '/';
    return NextResponse.redirect(new URL(nextParam, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api)(.*)'],
};
