/* @layer core @kind test */
import type {
  BankId,
  CelId,
  ExportFormat,
  FrameId,
  LayerId,
  Pivot2,
  Point,
  PresetId,
  Artwork,
  ArtworkId,
  Rect,
  RampId,
  SheetId,
  SheetLayout,
  Sprite,
  SpriteId,
  SpriteRole,
  SwatchId,
  TagDirection,
  TagId,
} from '@bxel/document';

type FixtureSlot =
  | { id: string; kind: 'transparent' }
  | { id: string; kind: 'color'; rgb: `#${string}`; name: string };

type FixtureBank = {
  id: string;
  name: string;
  cap: number;
  transparent: boolean;
  slots: FixtureSlot[];
  ramps: { id: string; name: string; swatches: string[] }[];
};

type FixtureSprite = {
  id: string;
  name: string;
  role: SpriteRole;
  bankId: string;
  width: number;
  height: number;
  pivot: Pivot2;
  layers: { id: string; name: string; visible: boolean; locked: boolean; cels: Record<string, string> }[];
  frames: { id: string; durationMs: number }[];
  tags: { id: string; name: string; from: string; to: string; direction: TagDirection; repeat: number }[];
  slices: never[];
  cels: Record<string, { rows: string[] }>;
};

type FixtureSheet = {
  id: string;
  name: string;
  layout: SheetLayout;
  spacing: Point;
  margin: number;
  entries: { spriteId: string; at: Point; source: Rect | null }[];
};

type FixturePreset = {
  id: string;
  name: string;
  format: ExportFormat;
  scale: number;
  scope: { sprites: string[]; layers: { by: 'all' }; frames: { by: 'all' } };
  sheetId: string | null;
  pathTemplate: string;
};

type ArtworkFixture = {
  id: string;
  name: string;
  defaultBankId: string;
  coverSpriteId: string | null;
  banks: FixtureBank[];
  sprites: FixtureSprite[];
  sheets: FixtureSheet[];
  presets: FixturePreset[];
};

const brand = <T extends string>(value: string): T => value as T;

const rowsToPixels = (rows: readonly string[]): Uint8Array =>
  Uint8Array.from(rows.join(''), (digit) => Number.parseInt(digit, 16));

const toBank = (bank: FixtureBank): Artwork['banks'][number] => ({
  id: brand<BankId>(bank.id),
  name: bank.name,
  cap: bank.cap,
  transparent: bank.transparent,
  slots: bank.slots.map((slot) =>
    slot.kind === 'transparent'
      ? { id: brand<SwatchId>(slot.id), kind: 'transparent' as const }
      : { id: brand<SwatchId>(slot.id), kind: 'color' as const, rgb: slot.rgb, name: slot.name },
  ),
  ramps: bank.ramps.map((ramp) => ({
    id: brand<RampId>(ramp.id),
    name: ramp.name,
    swatches: ramp.swatches.map((id) => brand<SwatchId>(id)),
  })),
});

const toSprite = (sprite: FixtureSprite): Sprite => ({
  id: brand<SpriteId>(sprite.id),
  name: sprite.name,
  role: sprite.role,
  bankId: brand<BankId>(sprite.bankId),
  width: sprite.width,
  height: sprite.height,
  pivot: sprite.pivot,
  layers: sprite.layers.map((layer) => ({
    id: brand<LayerId>(layer.id),
    name: layer.name,
    visible: layer.visible,
    locked: layer.locked,
    cels: Object.fromEntries(Object.entries(layer.cels).map(([frame, cel]) => [frame, brand<CelId>(cel)] as const)),
  })),
  frames: sprite.frames.map((frame) => ({ id: brand<FrameId>(frame.id), durationMs: frame.durationMs })),
  tags: sprite.tags.map((tag) => ({
    id: brand<TagId>(tag.id),
    name: tag.name,
    from: brand<FrameId>(tag.from),
    to: brand<FrameId>(tag.to),
    direction: tag.direction,
    repeat: tag.repeat,
  })),
  slices: [],
  cels: Object.fromEntries(
    Object.entries(sprite.cels).map(([id, cel]) => [id, { id: brand<CelId>(id), pixels: rowsToPixels(cel.rows) }] as const),
  ),
});

const toSheet = (sheet: FixtureSheet): Artwork['sheets'][number] => ({
  id: brand<SheetId>(sheet.id),
  name: sheet.name,
  layout: sheet.layout,
  spacing: sheet.spacing,
  margin: sheet.margin,
  entries: sheet.entries.map((entry) => ({ spriteId: brand<SpriteId>(entry.spriteId), at: entry.at, source: entry.source })),
});

const toPreset = (preset: FixturePreset): Artwork['presets'][number] => ({
  id: brand<PresetId>(preset.id),
  name: preset.name,
  format: preset.format,
  scale: preset.scale,
  scope: {
    sprites: preset.scope.sprites.map((id) => brand<SpriteId>(id)),
    layers: preset.scope.layers,
    frames: preset.scope.frames,
  },
  sheetId: preset.sheetId === null ? null : brand<SheetId>(preset.sheetId),
  pathTemplate: preset.pathTemplate,
  settings: {},
});

const fixtureToArtwork = (fixture: ArtworkFixture): Artwork => ({
  id: brand<ArtworkId>(fixture.id),
  name: fixture.name,
  defaultBankId: brand<BankId>(fixture.defaultBankId),
  coverSpriteId: fixture.coverSpriteId === null ? null : brand<SpriteId>(fixture.coverSpriteId),
  banks: fixture.banks.map(toBank),
  sprites: fixture.sprites.map(toSprite),
  sheets: fixture.sheets.map(toSheet),
  presets: fixture.presets.map(toPreset),
  tilesets: [],
  tilemaps: [],
  animations: [],
});

export { brand, fixtureToArtwork };
export type { ArtworkFixture };
