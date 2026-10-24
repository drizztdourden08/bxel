/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import { writeRect } from '../pixels/write-rect';
import { replaceSprite } from '../artwork/replace-sprite';
import { findSprite } from '../read/find-sprite';
import type { HistoryDirection, UndoOp } from './history.type';

const applyCelRect = (artwork: Artwork, op: Extract<UndoOp, { kind: 'cel-rect' }>, direction: HistoryDirection): Artwork => {
  const sprite = findSprite(artwork, op.spriteId);
  const cel = sprite?.cels[op.celId];
  if (!sprite || !cel) return artwork;
  const pixels = cel.pixels.slice();
  writeRect({
    target: pixels,
    stride: sprite.width,
    rect: op.rect,
    pixels: direction === 'undo' ? op.before : op.after,
    skipZero: false,
  });
  return replaceSprite(artwork, { ...sprite, cels: { ...sprite.cels, [op.celId]: { ...cel, pixels } } });
};

export { applyCelRect };
