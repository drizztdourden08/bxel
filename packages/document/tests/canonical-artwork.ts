/* @layer core @kind test */
import type { Artwork } from '@bxel/document';

const sortedKeys = (value: object): object =>
  Object.fromEntries(Object.entries(value).sort(([first], [second]) => first.localeCompare(second)));

const canonicalArtwork = (artwork: Artwork): string =>
  JSON.stringify(artwork, (_key, value: unknown) => {
    if (value instanceof Uint8Array) return Array.from(value).join('');
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) return sortedKeys(value);
    return value;
  });

export { canonicalArtwork };
