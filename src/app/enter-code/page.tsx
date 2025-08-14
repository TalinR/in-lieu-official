'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function EnterCodePage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const code = (new FormData(form).get('code') as string)?.trim();

    const res = await fetch('/api/redeem-code', {
      method: 'POST',
      body: JSON.stringify({ code }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const { message } = await res.json().catch(() => ({ message: 'Invalid code' }));
      setError(message || 'Invalid code');
      setLoading(false);
      return;
    }

    // Force the session token to refresh so middleware sees updated claims immediately
    await user?.reload(); // refreshes claims
    router.push(next);
  }

  return (
    <div style={{ maxWidth: 420, margin: '5rem auto', padding: 16 }}>
      <h1>Enter Presale Code</h1>
      <p>Signed in as {user?.primaryEmailAddress?.emailAddress ?? '...'}</p>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        <input
          name="code"
          placeholder="Enter access code"
          required
          autoFocus
          style={{ padding: 10, fontSize: 16 }}
        />
        <button
          disabled={loading}
          type="submit"
          style={{ padding: '10px 14px', fontSize: 16 }}
        >
          {loading ? 'Checking…' : 'Unlock'}
        </button>

        {error && <p style={{ color: 'crimson' }}>{error}</p>}
      </form>
    </div>
  );
}
