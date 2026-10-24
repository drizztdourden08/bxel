/* @layer tests @kind logic */
import type { BankId, CelId, FrameId, LayerId, PaletteBank, Artwork, ArtworkId, Sprite, SpriteId, SwatchId } from '@bxel/document';
import { brand } from './brand';
import type { LayerSpec, SpriteSpec } from './build-artwork.type';

const BANK_ID = brand<BankId>('bnk_000002');
const COLORS = ['#140b26', '#4b1fa0', '#7b3fe4', '#b02a9c', '#ff7a8a', '#f4eeff'] as const;

const bank: PaletteBank = {
  id: BANK_ID,
  name: 'Bxel 16',
  cap: 16,
  transparent: true,
  slots: [
    { id: brand<SwatchId>('sw_000003'), kind: 'transparent' },
    ...COLORS.map((rgb, at) => ({
      id: brand<SwatchId>(`sw_${String(at + 4).padStart(6, '0')}`),
      kind: 'color' as const,
      rgb,
      name: `Color ${at + 1}`,
    })),
  ],
  ramps: [],
};

const parseRows = (rows: readonly string[]): Uint8Array =>
  Uint8Array.from(rows.join(''), (cell) => (cell === '.' ? 0 : Number.parseInt(cell, 16)));

const buildLayer = (spec: LayerSpec): Sprite['layers'][number] => ({
  id: brand<LayerId>(spec.id),
  name: spec.name,
  visible: spec.visible ?? true,
  locked: spec.locked ?? false,
  cels: Object.fromEntries(Object.entries(spec.cels ?? {}).map(([frame, cel]) => [frame, brand<CelId>(cel)] as const)),
});

const buildSprite = (spec: SpriteSpec): Sprite => ({
  id: brand<SpriteId>(spec.id),
  name: spec.name,
  role: 'sprite',
  bankId: BANK_ID,
  width: spec.width,
  height: spec.height,
  pivot: spec.pivot ?? { x2: spec.width, y2: spec.height },
  layers: spec.layers.map(buildLayer),
  frames: spec.frames.map((id) => ({ id: brand<FrameId>(id), durationMs: 100 })),
  tags: [],
  slices: [],
  cels: Object.fromEntries(
    Object.entries(spec.cels).map(([id, rows]) => [id, { id: brand<CelId>(id), pixels: parseRows(rows) }] as const),
  ),
});

const buildArtwork = (sprites: readonly SpriteSpec[]): Artwork => ({
  id: brand<ArtworkId>('art_000001'),
  name: 'Raster tests',
  defaultBankId: BANK_ID,
  coverSpriteId: null,
  banks: [bank],
  sprites: sprites.map(buildSprite),
  sheets: [],
  presets: [],
  tilesets: [],
  tilemaps: [],
});

export { buildArtwork };
