/* @layer renderer-app @kind component */
import { useEffect, useState } from 'react';
import { Box, Span } from '@drizztdourden08/tessera';
import { useAnnounceStore } from '../../stores/useAnnounceStore';
import { ANNOUNCER_CLEAR_MS } from './Announcer.constants';

const Announcer = () => {
  const announcement = useAnnounceStore((state) => state.announcement);
  const [stale, setStale] = useState(0);
  useEffect(() => {
    const timer = window.setTimeout(() => setStale(announcement?.id ?? 0), ANNOUNCER_CLEAR_MS);
    return () => window.clearTimeout(timer);
  }, [announcement]);
  const current = announcement && announcement.id !== stale ? announcement : null;
  return (
    <Box className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
      {current && <Span key={current.id}>{current.text}</Span>}
    </Box>
  );
};

export { Announcer };
