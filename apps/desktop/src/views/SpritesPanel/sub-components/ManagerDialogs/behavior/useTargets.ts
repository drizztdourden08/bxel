/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import type { Sprite } from '@bxel/document';
import type { ManagerModel } from '../../../SpritesPanel.type';

const useTargets = (model: ManagerModel): readonly Sprite[] =>
  useMemo(() => {
    const chosen = new Set(model.ids);
    return model.artwork.sprites.filter((sprite) => chosen.has(sprite.id));
  }, [model.artwork, model.ids]);

export { useTargets };
