/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import type { CurrentPick } from '../../../editor/current-pick.type';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import { useTimelineStore } from '../../../stores/useTimelineStore';

const useCurrentPick = (): CurrentPick => {
  const spriteId = useSpriteStore((state) => state.activeId);
  const frameId = useTimelineStore((state) => state.frameId);
  return useMemo(() => ({ spriteId, frameId }), [spriteId, frameId]);
};

export { useCurrentPick };
