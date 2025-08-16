import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // CSRF protection (same pattern as email-opt-in)
    const url = new URL(req.url);
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    if ((origin && origin !== url.origin) || (!origin && referer && !referer.startsWith(url.origin + '/'))) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
    }

    const { productTitle, inWishlist } = await req.json().catch(() => ({}));
    if (typeof productTitle !== 'string' || typeof inWishlist !== 'boolean') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const current = (user.privateMetadata as Record<string, unknown> | undefined) ?? {};
    const currentWishlist = (current.wishlist as Record<string, boolean> | undefined) ?? {};

    // Update wishlist
    const updatedWishlist = { ...currentWishlist };
    if (inWishlist) {
      updatedWishlist[productTitle] = true;
    } else {
      delete updatedWishlist[productTitle];
    }

    await client.users.updateUser(userId, {
      privateMetadata: { ...current, wishlist: updatedWishlist },
    });

    return NextResponse.json({ 
      ok: true, 
      productTitle, 
      inWishlist,
      wishlist: updatedWishlist 
    });
  } catch (error) {
    console.error('wishlist error', error);
    return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
  }
}

// Get current wishlist
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const wishlist = (user.privateMetadata as Record<string, unknown> | undefined)?.wishlist ?? {};

    return NextResponse.json({ wishlist });
  } catch (error) {
    console.error('get wishlist error', error);
    return NextResponse.json({ error: 'Failed to get wishlist' }, { status: 500 });
  }
}