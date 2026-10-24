/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useSpriteScene } from '../../../hooks/useSpriteScene';
import { usePendingStore } from '../../../stores/usePendingStore';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import type { ModeBarModel } from '../ModeBar.type';
import { modeOptions } from './mode-options';

const useModeBar = (): ModeBarModel | null => {
  const model = useSpriteScene();
  const mode = useSpriteStore((state) => state.mode);
  const isolated = useSpriteStore((state) => state.isolated);
  const broadcast = useSpriteStore((state) => state.broadcast);
  const previewing = usePendingStore((state) => state.pending !== null);
  const total = model?.scene.sprites.length ?? 0;
  const count = model?.scene.selected.length ?? 0;
  const present = model !== null;
  return useMemo(
    () => (present ? { mode, isolated, broadcast, count, canBroadcast: mode === 'sprite' && count > 1, options: modeOptions(previewing, total) } : null),
    [present, mode, isolated, broadcast, previewing, total, count],
  );
};

export { useModeBar };
