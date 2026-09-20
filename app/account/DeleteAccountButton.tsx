'use client';

import { useState } from 'react';
import { clearConversationId } from '@/lib/squishy';

export default function DeleteAccountButton() {
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm('Permanently delete your account and all maps? This cannot be undone.')) {
      return;
    }

    setBusy(true);
    clearConversationId();

    try {
      const res = await fetch('/api/account/delete', { method: 'POST' });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: 'unknown' }));
        throw new Error(error);
      }
      window.location.href = '/?deleted=1';
    } catch {
      alert('Account deletion failed. Please try again.');
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      className="btn btn-danger min-h-[44px]"
      disabled={busy}
      onClick={handleDelete}
    >
      {busy ? <><span className="spin" /> Deleting…</> : 'Delete my account'}
    </button>
  );
}
