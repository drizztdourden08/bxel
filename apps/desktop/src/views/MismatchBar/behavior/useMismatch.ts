/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useEditorTarget } from '../../../hooks/useEditorTarget';
import { useSpriteScene } from '../../../hooks/useSpriteScene';
import { broadcastGroup } from '../../../sheet/broadcast-group';
import { groupSprites } from '../../../sheet/group-sprites';
import { mismatchModel } from '../../../sheet/mismatch-model';
import type { MismatchModel } from '../../../sheet/sheet.type';
import { useSpriteStore } from '../../../stores/useSpriteStore';

const useMismatch = (): MismatchModel | null => {
  const target = useEditorTarget();
  const model = useSpriteScene();
  const broadcast = useSpriteStore((state) => state.broadcast);
  const gap = useSpriteStore((state) => state.gap);
  const spritesScope = useSpriteStore((state) => state.spritesScope);
  return useMemo(() => {
    if (!target || !model) return null;
    const { scene } = model;
    const paint = broadcast ? mismatchModel(scene, target.layer.name, broadcastGroup(scene, true), true) : null;
    if (paint || gap === null) return paint;
    return mismatchModel(scene, gap, groupSprites(scene, spritesScope), false);
  }, [target, model, broadcast, gap, spritesScope]);
};

export { useMismatch };
