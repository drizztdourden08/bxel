/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey } from '@bxel/document';
import type { RgbaImage } from '@bxel/formats';
import { previewOf } from '../asset-overview/preview-of';
import type { PreviewColour } from '../asset-overview/asset-overview.type';
import { keyId } from '../workspace/key-id';

const SWATCH_COLUMNS = 4;
const SWATCH_CELL = 4;
const SWATCH_LIMIT = 16;

const channel = (value: string, at: number): number => Number.parseInt(value.slice(at, at + 2), 16) || 0;

const swatchImage = (colours: readonly PreviewColour[]): RgbaImage => {
  const shown = colours.slice(0, SWATCH_LIMIT);
  const rows = Math.max(1, Math.ceil(shown.length / SWATCH_COLUMNS));
  const width = SWATCH_COLUMNS * SWATCH_CELL;
  const height = rows * SWATCH_CELL;
  const data = new Uint8ClampedArray(width * height * 4);
  shown.forEach((colour, at) => {
    const x0 = (at % SWATCH_COLUMNS) * SWATCH_CELL;
    const y0 = Math.floor(at / SWATCH_COLUMNS) * SWATCH_CELL;
    const hex = colour.rgb.replace('#', '');
    for (let y = 0; y < SWATCH_CELL; y += 1) {
      for (let x = 0; x < SWATCH_CELL; x += 1) {
        const o = ((y0 + y) * width + x0 + x) * 4;
        data.set(colour.transparent ? [0, 0, 0, 0] : [channel(hex, 0), channel(hex, 2), channel(hex, 4), 255], o);
      }
    }
  });
  return { data, width, height };
};

const cache = new WeakMap<Artwork, Map<string, RgbaImage | null>>();

const drawn = (artwork: Artwork, key: AssetKey): RgbaImage | null => {
  const preview = previewOf(artwork, key);
  if (preview.kind === 'image') return preview.image;
  if (preview.kind === 'frames') return preview.frames[0]?.image ?? null;
  return preview.kind === 'swatches' ? swatchImage(preview.colours) : null;
};

/** The still picture of one asset for a tile or a row. It is drawn once per version of the document. */
const thumbImage = (artwork: Artwork, key: AssetKey): RgbaImage | null => {
  const held = cache.get(artwork) ?? new Map<string, RgbaImage | null>();
  cache.set(artwork, held);
  const id = keyId(key);
  if (held.has(id)) return held.get(id) ?? null;
  const image = drawn(artwork, key);
  held.set(id, image);
  return image;
};

export { thumbImage };
