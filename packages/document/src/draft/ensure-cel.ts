/* @layer core @kind logic */
import type { CelId } from '../model/ids.type';
import { emptyCel } from '../pixels/empty-cel';
import { requireSprite } from '../read/require-sprite';
import type { ResolvedCel } from '../scope/resolved-scope.type';
import type { Draft } from './draft.type';
import { updateSprite } from './update-sprite';

const ensureCel = (draft: Draft, target: ResolvedCel): CelId => {
  if (target.celId) return target.celId;
  const celId = draft.ids.next('cel') as CelId;
  const pixels = emptyCel(requireSprite(draft.artwork, target.spriteId));
  draft.owned.set(celId, pixels);
  updateSprite(draft, target.spriteId, (sprite) => ({
    ...sprite,
    layers: sprite.layers.map((layer) =>
      layer.id === target.layerId ? { ...layer, cels: { ...layer.cels, [target.frameId]: celId } } : layer,
    ),
    cels: { ...sprite.cels, [celId]: { id: celId, pixels } },
  }));
  return celId;
};

export { ensureCel };
