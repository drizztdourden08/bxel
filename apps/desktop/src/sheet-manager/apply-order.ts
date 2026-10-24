/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { SpriteId } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';
import { runDocument } from '../sheet/run-document';
import { spritesTarget } from '../sheet/sprites-target';
import { LABEL } from './manager-text.constants';
import { orderMoves } from './order-moves';
import { wantedOrder } from './wanted-order';

const applyOrder = (sorted: readonly SpriteId[]): boolean => {
  const artwork = currentArtwork();
  if (!artwork) return false;
  const moves = orderMoves(
    artwork.sprites.map((sprite) => sprite.id),
    wantedOrder(artwork.sprites, sorted),
  );
  const steps = moves.map((move) => ({ name: COMMAND_NAME.spriteReorder, targets: spritesTarget([move.id]), options: { to: move.to } }));
  return steps.length > 0 && runDocument(LABEL.sortNames, steps) !== null;
};

export { applyOrder };
