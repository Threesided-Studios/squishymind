'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteMapButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm('Delete this mind map?')) return;

    setBusy(true);
    try {
      const res = await fetch(`/api/mindmaps/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('delete failed');
      router.refresh();
    } catch {
      alert('Could not delete this map. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      className="btn btn-danger text-xs min-h-[44px] min-w-[44px] px-4 ml-auto"
      disabled={busy}
      onClick={handleDelete}
    >
      {busy ? 'Deleting…' : 'Delete'}
    </button>
  );
}
