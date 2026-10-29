/* @layer tests @kind test */
import type { Artwork } from '@bxel/document';
import { celRows, createdCelRows, okOf, pixelEngine, request, scopeOf, stepOf } from './advanced-kit';
import { emptyArtwork, rowsIds } from './rows-artwork';

const scope = scopeOf([rowsIds.sprite]);

const at = (x: number, y: number) => ({ x, y });

const rowsOf = (engine: ReturnType<typeof pixelEngine>) => celRows(engine.state().artwork, rowsIds.sprite, rowsIds.cel);

const rowsAfter = (artwork: Artwork, name: string, options: Record<string, unknown>): string[] => {
  const engine = pixelEngine(artwork);
  okOf(engine.execute(request([stepOf(name, scope, options)])));
  return rowsOf(engine);
};

const drawnOnEmpty = (width: number, height: number, name: string, options: Record<string, unknown>): string[] => {
  const engine = pixelEngine(emptyArtwork(width, height));
  okOf(engine.execute(request([stepOf(name, scope, options)])));
  return createdCelRows(engine.state().artwork, rowsIds.sprite);
};

export { at, drawnOnEmpty, rowsAfter, rowsOf, scope };
