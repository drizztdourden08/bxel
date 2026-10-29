/* @layer renderer-app @kind hook */
import { MAX_SPRITE_SIZE, MIN_SPRITE_SIZE } from '@bxel/document';
import { useEffect, useMemo, useState } from 'react';
import { currentTarget } from '../../../editor/current-target';
import { useCanvasSizeStore } from '../../../stores/useCanvasSizeStore';
import { resizeClips } from '../../../sheet-manager/resize-clips';
import type { ResizeSpec } from '../../../sheet-manager/manager.type';
import type { CanvasSizeForm } from '../CanvasSizeDialog.type';

const inRange = (side: number): boolean => Number.isInteger(side) && side >= MIN_SPRITE_SIZE && side <= MAX_SPRITE_SIZE;

const useCanvasSizeForm = (): CanvasSizeForm => {
  const sprite = useMemo(() => currentTarget()?.sprite ?? null, []);
  const [spec, setSpec] = useState<ResizeSpec>({ width: sprite?.width ?? 1, height: sprite?.height ?? 1, anchor: 'center' });
  const clips = useMemo(() => (sprite && inRange(spec.width) && inRange(spec.height) ? resizeClips([sprite], spec) : 0), [sprite, spec]);
  useEffect(() => {
    useCanvasSizeStore.getState().setPreview(sprite && inRange(spec.width) && inRange(spec.height) ? spec : null);
  }, [sprite, spec]);
  return {
    spec,
    clips,
    valid: sprite !== null && inRange(spec.width) && inRange(spec.height),
    update: (change) => setSpec((current) => ({ ...current, ...change })),
  };
};

export { useCanvasSizeForm };
