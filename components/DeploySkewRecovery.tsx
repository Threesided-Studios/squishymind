'use client';

import { useEffect } from 'react';

const STALE_ACTION =
  'Failed to find Server Action. This request might be from an older or newer deployment.';

// After a deploy, a tab can still hold JS that references Server Action IDs from
// the previous build. Next.js surfaces that as an unhandled rejection on the
// client; a hard reload fetches the current bundle and clears the mismatch.
export default function DeploySkewRecovery() {
  useEffect(() => {
    function onUnhandledRejection(event: PromiseRejectionEvent) {
      const reason = event.reason;
      const message =
        typeof reason === 'string'
          ? reason
          : reason instanceof Error
            ? reason.message
            : '';

      if (!message.includes(STALE_ACTION)) return;

      event.preventDefault();
      window.location.reload();
    }

    window.addEventListener('unhandledrejection', onUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', onUnhandledRejection);
  }, []);

  return null;
}
