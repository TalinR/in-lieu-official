'use client';
import { useClerk } from '@clerk/nextjs';

export default function SignOutButton() {
  const { signOut } = useClerk();
  return (
    <button
      onClick={() => signOut({ redirectUrl: '/sign-in' })}
      className="px-3 py-1 rounded border"
    >
      Sign out
    </button>
  );
}