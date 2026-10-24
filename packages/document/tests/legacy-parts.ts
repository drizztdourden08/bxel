/* @layer core @kind test */
import type {
  BankId,
  CelId,
  ExportPreset,
  FrameId,
  LayerId,
  PaletteBank,
  PresetId,
  RampId,
  Sheet,
  SheetId,
  Sprite,
  SpriteId,
  SwatchId,
} from '@bxel/document';
import { brand } from './fixture-to-artwork';

const num = (value: number): string => String(value).padStart(6, '0');

const makeBank = (base: PaletteBank, start: number, name: string): PaletteBank => {
  const ids = new Map(base.slots.map((slot, index) => [slot.id, brand<SwatchId>(`sw_${num(start + 1 + index)}`)] as const));
  return {
    ...base,
    id: brand<BankId>(`bnk_${num(start)}`),
    name,
    slots: base.slots.map((slot) => ({ ...slot, id: ids.get(slot.id) ?? slot.id })),
    ramps: base.ramps.map((ramp, index) => ({
      id: brand<RampId>(`rmp_${num(start + 50 + index)}`),
      name: ramp.name,
      swatches: ramp.swatches.map((swatch) => ids.get(swatch) ?? swatch),
    })),
  };
};

const makeSprite = (start: number, name: string, bankId: BankId, extra: Partial<Sprite> = {}): Sprite => {
  const frame = brand<FrameId>(`frm_${num(start + 1)}`);
  const cel = brand<CelId>(`cel_${num(start + 2)}`);
  return {
    id: brand<SpriteId>(`spr_${num(start)}`),
    name,
    role: 'sprite',
    bankId,
    width: 4,
    height: 4,
    pivot: { x2: 0, y2: 0 },
    layers: [{ id: brand<LayerId>(`lay_${num(start + 3)}`), name: 'Body', visible: true, locked: false, cels: { [frame]: cel } }],
    frames: [{ id: frame, durationMs: 100 }],
    tags: [],
    slices: [],
    cels: { [cel]: { id: cel, pixels: Uint8Array.from({ length: 16 }, (_, index) => index % 3) } },
    ...extra,
  };
};

const makeSheet = (start: number, name: string, sprites: readonly Sprite[]): Sheet => ({
  id: brand<SheetId>(`sht_${num(start)}`),
  name,
  layout: { kind: 'manual' },
  spacing: { x: 0, y: 0 },
  margin: 0,
  entries: sprites.map((sprite, index) => ({
    spriteId: sprite.id,
    at: { x: index * 5, y: 0 },
    source: index === 1 ? { x: 0, y: 0, width: 2, height: 2 } : null,
  })),
});

const makePreset = (start: number, name: string, sprites: readonly Sprite[], sheetId: SheetId | null): ExportPreset => ({
  id: brand<PresetId>(`exp_${num(start)}`),
  name,
  format: 'png',
  scale: 2,
  scope: { sprites: sprites.map((sprite) => sprite.id), layers: { by: 'all' }, frames: { by: 'all' } },
  sheetId,
  pathTemplate: '{sprite}.png',
  settings: {},
});

export { makeBank, makePreset, makeSheet, makeSprite };
