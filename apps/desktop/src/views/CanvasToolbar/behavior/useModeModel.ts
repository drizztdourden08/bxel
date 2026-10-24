/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useSpriteScene } from '../../../hooks/useSpriteScene';
import { usePendingStore } from '../../../stores/usePendingStore';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import type { ModeModel } from '../CanvasToolbar.type';

const useModeModel = (): ModeModel => {
  const model = useSpriteScene();
  const mode = useSpriteStore((state) => state.mode);
  const isolated = useSpriteStore((state) => state.isolated);
  const broadcast = useSpriteStore((state) => state.broadcast);
  const previewing = usePendingStore((state) => state.pending !== null);
  const total = model?.scene.sprites.length ?? 0;
  const count = model?.scene.selected.length ?? 0;
  const present = model !== null;
  return useMemo(
    () => ({ mode, isolated, broadcast, previewing, total, present, canBroadcast: mode === 'sprite' && count > 1 }),
    [present, mode, isolated, broadcast, previewing, total, count],
  );
};

export { useModeModel };
