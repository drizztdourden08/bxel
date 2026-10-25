/* @layer renderer-app @kind hook */
import { useEffect, useRef } from 'react';
import { announce } from '@drizztdourden08/brock-react';
import { ANNOUNCE_TEXT } from '../announce/announce.constants';
import { useSpriteStore } from '../stores/useSpriteStore';

const useAnnounceMode = (): void => {
  const mode = useSpriteStore((state) => state.mode);
  const seen = useRef(mode);
  useEffect(() => {
    if (seen.current === mode) return;
    seen.current = mode;
    announce(ANNOUNCE_TEXT.mode(mode));
  }, [mode]);
};

export { useAnnounceMode };
