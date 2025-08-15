import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { get } from '@vercel/edge-config';
import { NextResponse } from 'next/server';

const isPublic = createRouteMatcher([
  '/sign-in(.*)', '/sign-up(.*)', '/sign-out(.*)', '/enter-code(.*)', '/api/redeem-code(.*)', '/api/delete-account(.*)',
  '/_next/static/(.*)', '/_next/image/(.*)', '/favicon.ico', '/robots.txt',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublic(req)) return;

  const { userId, sessionClaims, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn({ returnBackUrl: req.url });

  const email = (sessionClaims?.email as string | undefined)?.toLowerCase();
  const approved = Boolean(sessionClaims?.approved);

  if (approved) return NextResponse.next();

  const list = (await get<string[]>('whitelist_emails')) ?? [];
  if (email && list.includes(email)) return NextResponse.next();

  const url = new URL('/enter-code', req.url);
  url.searchParams.set('next', req.url);
  return NextResponse.redirect(url);
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api)(.*)'],
};
