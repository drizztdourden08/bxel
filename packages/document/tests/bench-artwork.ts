/* @layer tests @kind helper */
import type {
  Artwork,
  ArtworkId,
  BankId,
  Cel,
  CelId,
  DocumentState,
  Frame,
  FrameId,
  Layer,
  LayerId,
  PaletteBank,
  Sprite,
  SpriteId,
  SwatchId,
} from '@bxel/document';

type SpriteSpec = { readonly index: number; readonly side: number; readonly layers: number; readonly frames: number };

const BANK_ID = 'bnk_000001' as BankId;
const PALETTE = ['#140b26', '#4b1fa0', '#7b3fe4', '#b02a9c', '#e0568a', '#f5a35c', '#f7e38c'];

const bank: PaletteBank = {
  id: BANK_ID,
  name: 'Bench bank',
  cap: 16,
  transparent: true,
  slots: [
    { id: 'sw_000000' as SwatchId, kind: 'transparent' },
    ...PALETTE.map((rgb, at) => ({ id: `sw_${String(at + 1).padStart(6, '0')}` as SwatchId, kind: 'color' as const, rgb: rgb as `#${string}`, name: rgb })),
  ],
  ramps: [],
};

const sketch = (side: number, seed: number): Uint8Array => {
  const pixels = new Uint8Array(side * side);
  for (let at = 0; at < pixels.length; at += 1) {
    const x = at % side;
    const y = Math.floor(at / side);
    const blob = ((x >> 3) + (y >> 3) + seed) % (PALETTE.length + 2);
    pixels[at] = blob > PALETTE.length ? 0 : blob;
  }
  return pixels;
};

const pad = (prefix: string, value: number): string => `${prefix}_${String(value).padStart(6, '0')}`;

const buildSprite = (spec: SpriteSpec): Sprite => {
  const base = spec.index * 1000;
  const frames: Frame[] = Array.from({ length: spec.frames }, (_, at) => ({ id: pad('frm', base + at) as FrameId, durationMs: 100 }));
  const cels: Record<string, Cel> = {};
  const layers: Layer[] = Array.from({ length: spec.layers }, (_, row) => {
    const byFrame: Record<string, CelId> = {};
    for (const [at, frame] of frames.entries()) {
      const id = pad('cel', base + row * 100 + at) as CelId;
      cels[id] = { id, pixels: sketch(spec.side, base + row + at) };
      byFrame[frame.id] = id;
    }
    return { id: pad('lay', base + row) as LayerId, name: `Layer ${row + 1}`, visible: true, locked: false, cels: byFrame };
  });
  return {
    id: pad('spr', spec.index) as SpriteId,
    name: `sprite-${spec.index}`,
    role: 'sprite',
    bankId: BANK_ID,
    width: spec.side,
    height: spec.side,
    pivot: { x2: spec.side, y2: spec.side },
    layers,
    frames,
    tags: [],
    slices: [],
    cels,
  };
};

const benchArtwork = (specs: readonly SpriteSpec[]): DocumentState => {
  const artwork: Artwork = {
    id: 'art_000001' as ArtworkId,
    name: 'Bench',
    defaultBankId: BANK_ID,
    coverSpriteId: null,
    banks: [bank],
    sprites: specs.map(buildSprite),
    sheets: [],
    presets: [],
    tilesets: [],
    tilemaps: [],
  };
  return { documentId: 'doc_000001' as DocumentState['documentId'], revision: 1, artwork, readOnly: false };
};

export { benchArtwork };
