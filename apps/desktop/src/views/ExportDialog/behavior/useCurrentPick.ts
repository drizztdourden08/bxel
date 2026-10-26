/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import type { CurrentPick } from '../../../editor/current-pick.type';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import { useTilemapStore } from '../../../stores/useTilemapStore';

const useCurrentPick = (): CurrentPick => {
  const spriteId = useSpriteStore((state) => state.activeId);
  const tilemapId = useTilemapStore((state) => state.mapId);
  return useMemo(() => ({ spriteId, frameId: null, tilemapId }), [spriteId, tilemapId]);
};

export { useCurrentPick };
