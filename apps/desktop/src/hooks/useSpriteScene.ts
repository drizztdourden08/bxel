/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import type { SceneModel } from '../sheet/sheet.type';
import { spriteScene } from '../sheet/sprite-scene';
import { useSpriteStore } from '../stores/useSpriteStore';
import { useActiveDocument } from './useActiveDocument';

const useSpriteScene = (): SceneModel | null => {
  const view = useActiveDocument();
  const activeId = useSpriteStore((state) => state.activeId);
  const selected = useSpriteStore((state) => state.selected);
  const artwork = view?.state.artwork ?? null;
  return useMemo(() => (artwork ? { artwork, scene: spriteScene(artwork, { activeId, selected }) } : null), [artwork, activeId, selected]);
};

export { useSpriteScene };
