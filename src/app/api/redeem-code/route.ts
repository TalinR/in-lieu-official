// app/api/redeem-code/route.ts
import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const validCodes = new Set(
  (process.env.ACCESS_CODES ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
);

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ message: 'Not signed in' }, { status: 401 });

  const { code } = await req.json().catch(() => ({ code: '' }));
  if (!validCodes.has(code)) {
    return NextResponse.json({ message: 'Invalid code' }, { status: 400 });
  }

  try {
    const client = await clerkClient();
    
    // Mark user as approved (persistent, server-only). Merge to preserve existing keys.
    const current = await client.users.getUser(userId);
    const currentPrivate = (current.privateMetadata as Record<string, unknown> | undefined) ?? {};
    await client.users.updateUser(userId, {
      privateMetadata: { ...currentPrivate, approved: true },
    });

    // (Optional) Also add their email to Clerk's allowlist for future sign-ups
    // This isn't required for your flow, but it's a nice bonus.
    try {
      const user = await client.users.getUser(userId);
      const email = user.primaryEmailAddress?.emailAddress;
      if (email) {
        await client.allowlistIdentifiers.createAllowlistIdentifier({
          identifier: email,
          notify: false,
        });
      }
    } catch {
      // ignore allowlist errors silently for this quick gate
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Failed to update user' }, { status: 500 });
  }
}
