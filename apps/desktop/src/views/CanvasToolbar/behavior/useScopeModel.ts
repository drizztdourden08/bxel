/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useSpriteScene } from '../../../hooks/useSpriteScene';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import type { ScopeModel } from '../CanvasToolbar.type';

const useScopeModel = (): ScopeModel => {
  const model = useSpriteScene();
  const mode = useSpriteStore((state) => state.mode);
  const isolated = useSpriteStore((state) => state.isolated);
  const broadcast = useSpriteStore((state) => state.broadcast);
  const count = model?.scene.selected.length ?? 0;
  return useMemo(() => ({ isolated, broadcast, canBroadcast: mode === 'sprite' && count > 1 }), [mode, isolated, broadcast, count]);
};

export { useScopeModel };
