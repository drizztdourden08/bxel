/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import type { CurrentPick } from '../../../editor/current-pick.type';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useTimelineStore } from '../../../stores/useTimelineStore';

const useCurrentPick = (): CurrentPick => {
  const spriteId = useSpriteStore((state) => state.activeId);
  const frameId = useTimelineStore((state) => state.frameId);
  const tilemapId = useTilemapStore((state) => state.mapId);
  return useMemo(() => ({ spriteId, frameId, tilemapId }), [spriteId, frameId, tilemapId]);
};

export { useCurrentPick };
