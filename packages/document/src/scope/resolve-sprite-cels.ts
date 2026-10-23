/* @layer core @kind logic */
import type { Sprite } from '../model/sprite.type';
import { resolveFrames } from './resolve-frames';
import { resolveLayers } from './resolve-layers';
import type { SpriteCels } from './resolved-scope.type';
import type { TargetScope } from './target-scope.type';

const resolveSpriteCels = (sprite: Sprite, scope: TargetScope, step: number): SpriteCels => {
  const picked = resolveLayers({ sprite, selector: scope.layers, step });
  const frames = resolveFrames({ sprite, selector: scope.frames });
  const cels = picked.layers.flatMap((layer) =>
    frames.map((frame) => ({
      spriteId: sprite.id,
      layerId: layer.id,
      frameId: frame.id,
      celId: layer.cels[frame.id] ?? null,
    })),
  );
  return { cels, warnings: picked.warnings };
};

export { resolveSpriteCels };
