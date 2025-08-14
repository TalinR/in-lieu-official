// app/api/redeem-code/route.ts
import { auth, createClerkClient } from '@clerk/nextjs/server';
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
    const client = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    
    // Mark user as approved
    await client.users.updateUser(userId, {
      publicMetadata: { approved: true },
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
