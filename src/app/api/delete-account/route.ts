import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function DELETE(req: Request) {
  try {
    // Basic CSRF protection: ensure the request originates from our own origin
    const requestUrl = new URL(req.url);
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    if ((origin && origin !== requestUrl.origin) || (!origin && referer && !referer.startsWith(requestUrl.origin + '/'))) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
    }

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clerkClient();
    await client.users.deleteUser(userId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to delete account', error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}


