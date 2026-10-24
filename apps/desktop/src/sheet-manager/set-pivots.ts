/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { SpriteId } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';
import { runDocument } from '../sheet/run-document';
import { spritesTarget } from '../sheet/sprites-target';
import { LABEL } from './manager-text.constants';
import type { PivotMode } from './manager.type';
import { pivotFor } from './pivot-for';

const setPivots = (ids: readonly SpriteId[], mode: PivotMode): boolean => {
  const artwork = currentArtwork();
  if (!artwork || ids.length === 0) return false;
  const targets = ids.flatMap((id) => artwork.sprites.filter((sprite) => sprite.id === id));
  const steps = targets.flatMap((sprite) => {
    const pivot = pivotFor(sprite, mode, targets[0]);
    const same = pivot.x2 === sprite.pivot.x2 && pivot.y2 === sprite.pivot.y2;
    return same ? [] : [{ name: COMMAND_NAME.spriteUpdate, targets: spritesTarget([sprite.id]), options: { pivot } }];
  });
  return steps.length > 0 && runDocument(LABEL.pivot(steps.length), steps) !== null;
};

export { setPivots };
