'use client';

import { Fragment, type PropsWithChildren, useCallback, useEffect, useRef } from 'react';
import { useBoolean } from 'usehooks-ts';

const MockProvider = ({ children }: PropsWithChildren) => {
  const isMockEnabled = process.env.NEXT_PUBLIC_MOCK_API === 'true';

  const { setTrue: setWorkerReady, value: isWorkerReady } = useBoolean(false);

  const initRef = useRef(false);

  const startMocks = useCallback(
    async (mounted: { current: boolean }) => {
      if (initRef.current) return;
      initRef.current = true;

      try {
        const { worker } = await import('@/api/rest-client/mock/browser');

        if (!mounted.current) return;

        await worker.start({
          onUnhandledRequest: 'bypass',
          quiet: true
        });

        if (mounted.current) {
          setWorkerReady();
          console.log('🛠️ [MSW] Mock Service Worker is active');
        }
      } catch (error) {
        console.error('❌ [MSW] Failed to start Mock Environment:', error);
        initRef.current = false;
      }
    },
    [setWorkerReady]
  );

  useEffect(() => {
    if (!isMockEnabled || globalThis.window === undefined) return;

    const mounted = { current: true };

    void startMocks(mounted);

    return () => {
      mounted.current = false;
    };
  }, [isMockEnabled, startMocks]);

  if (isMockEnabled && !isWorkerReady) {
    return null;
  }

  return <Fragment>{children}</Fragment>;
};

export default MockProvider;
