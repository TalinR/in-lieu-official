import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    if ((origin && origin !== url.origin) || (!origin && referer && !referer.startsWith(url.origin + '/'))) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
    }

    const { value } = await req.json().catch(() => ({ value: undefined }));
    if (typeof value !== 'boolean') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const current = (user.privateMetadata as Record<string, unknown> | undefined) ?? {};
    await client.users.updateUser(userId, {
      privateMetadata: { ...current, email_opt_in: value },
    });
    return NextResponse.json({ ok: true, emailOptIn: value });
  } catch (error) {
    console.error('email-opt-in error', error);
    return NextResponse.json({ error: 'Failed to update email opt-in' }, { status: 500 });
  }
}


