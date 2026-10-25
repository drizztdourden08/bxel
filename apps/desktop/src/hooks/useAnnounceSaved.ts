/* @layer renderer-app @kind hook */
import { useEffect, useRef } from 'react';
import { announce } from '@drizztdourden08/brock-react';
import { ANNOUNCE_TEXT } from '../announce/announce.constants';
import { useActiveAsset } from './useActiveAsset';

const useAnnounceSaved = (): void => {
  const asset = useActiveAsset();
  const seen = useRef<{ key: string | null; dirty: boolean }>({ key: null, dirty: false });
  const key = asset?.tab?.id ?? null;
  const dirty = asset?.dirty ?? false;
  const name = asset?.name ?? '';
  useEffect(() => {
    const before = seen.current;
    seen.current = { key, dirty };
    if (key !== null && before.key === key && before.dirty && !dirty) announce(ANNOUNCE_TEXT.saved(name));
  }, [key, dirty, name]);
};

export { useAnnounceSaved };
