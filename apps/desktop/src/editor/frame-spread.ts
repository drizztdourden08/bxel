/* @layer renderer-app @kind logic */
import type { LayerScopeChip } from '../stores/layer-view-store.type';
import type { EditorTarget } from './editor.type';
import { frameSprites } from './frame-sprites';
import type { FrameSpread } from './layer-items.type';

const frameSpread = (target: EditorTarget, scope: LayerScopeChip): FrameSpread | null => {
  if (!target.animation || scope !== 'all') return null;
  const sprites = frameSprites(target);
  const have = new Map<string, number>();
  for (const sprite of sprites) {
    for (const key of new Set(sprite.layers.map((layer) => layer.name.toLowerCase()))) have.set(key, (have.get(key) ?? 0) + 1);
  }
  return { total: sprites.length, have };
};

export { frameSpread };
