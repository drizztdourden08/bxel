/* @layer renderer-app @kind hook */
import type { Sprite } from '@bxel/document';
import { useMemo } from 'react';
import { useAssetLook } from '../asset-view/useAssetLook';
import type { CanvasLook } from './canvas-look.type';
import { spriteLook } from './sprite-look';
import { useCanvasLook } from './useCanvasLook';

const useSpriteLook = (target: { readonly sprite: Sprite } | null): CanvasLook => {
  const look = useCanvasLook();
  const grid = target?.sprite.pixelGrid;
  const own = useMemo(() => spriteLook(look, grid), [look, grid]);
  return useAssetLook(own);
};

export { useSpriteLook };
