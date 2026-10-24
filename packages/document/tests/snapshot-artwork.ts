/* @layer core @kind test */
import type { Artwork } from '@bxel/document';

const snapshotArtwork = (artwork: Artwork): string =>
  JSON.stringify(artwork, (_key, value: unknown) =>
    value instanceof Uint8Array ? Array.from(value).join('') : value,
  );

export { snapshotArtwork };
