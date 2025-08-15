import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // CSRF-ish same-origin check
    const url = new URL(req.url);
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    if ((origin && origin !== url.origin) || (!origin && referer && !referer.startsWith(url.origin + '/'))) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const current = (user.privateMetadata as Record<string, unknown> | undefined) ?? {};

    // Initialize email_opt_in to true if missing
    if (current.email_opt_in === undefined) {
      await client.users.updateUser(userId, {
        privateMetadata: { ...current, email_opt_in: true },
      });
    }

    const emailOptIn = (current.email_opt_in === undefined) ? true : Boolean(current.email_opt_in);
    const approved = Boolean(current.approved);
    return NextResponse.json({ ok: true, approved, emailOptIn });
  } catch (error) {
    console.error('init-user error', error);
    return NextResponse.json({ error: 'Failed to initialize user' }, { status: 500 });
  }
}


