/* @layer renderer-app @kind logic */
import type { Artwork, Sprite } from '@bxel/document';
import { SPRITE_TEXT } from '../sheet/sprite-label.constants';
import { deleteImpact } from './delete-impact';
import type { DeletePlan } from './delete.type';

const deletePlan = (artwork: Artwork, targets: readonly Sprite[]): DeletePlan => {
  const impacts = targets.map((sprite) => deleteImpact(artwork, sprite));
  const gone = new Set(targets.map((sprite) => sprite.id));
  const keeps = artwork.sprites.some((sprite) => sprite.role === 'sprite' && !gone.has(sprite.id));
  return {
    impacts,
    used: impacts.filter((impact) => impact.sheets + impact.tilemaps > 0).length,
    blocker: keeps ? null : SPRITE_TEXT.lastOne,
  };
};

export { deletePlan };
