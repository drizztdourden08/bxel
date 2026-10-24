/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import type { SheetSizes } from './sheet-overlap.type';

const sheetSizes = (artwork: Artwork): SheetSizes =>
  new Map(artwork.sprites.map((sprite) => [sprite.id, { width: sprite.width, height: sprite.height }] as const));

export { sheetSizes };
