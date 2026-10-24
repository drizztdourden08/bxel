/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import { updateSprite } from '../../draft/update-sprite';
import type { CelId, FrameId, SpriteId } from '../../model/ids.type';
import type { Layer } from '../../model/sprite.type';
import { dropOrphans } from './drop-orphans';
import { mergeCel } from './merge-cel';

const mergeLayer = (draft: Draft, spriteId: SpriteId, source: Layer, target: Layer): void => {
  const cels: Record<FrameId, CelId> = { ...target.cels };
  for (const [frameId, from] of Object.entries(source.cels)) {
    const merged = mergeCel(draft, { spriteId, sourceLayer: source.id, from, into: target.cels[frameId as FrameId] });
    if (merged !== null) cels[frameId as FrameId] = merged;
  }
  updateSprite(draft, spriteId, (sprite) => {
    const layers = sprite.layers.filter((item) => item.id !== source.id).map((item) => (item.id === target.id ? { ...item, cels } : item));
    return { ...sprite, layers, cels: dropOrphans(sprite.cels, source, layers) };
  });
};

export { mergeLayer };
