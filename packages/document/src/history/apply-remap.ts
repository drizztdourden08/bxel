/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import { remapCel } from '../pixels/remap-cel';
import type { HistoryDirection, UndoOp } from './history.type';

const applyRemap = (artwork: Artwork, op: Extract<UndoOp, { kind: 'cel-remap' }>, direction: HistoryDirection): Artwork => {
  const table = direction === 'undo' ? op.inverse : op.forward;
  return {
    ...artwork,
    sprites: artwork.sprites.map((sprite) => {
      if (sprite.bankId !== op.bankId) return sprite;
      const entries = Object.values(sprite.cels).map((cel) => [cel.id, { ...cel, pixels: remapCel(cel.pixels, table) }] as const);
      return { ...sprite, cels: Object.fromEntries(entries) };
    }),
  };
};

export { applyRemap };
