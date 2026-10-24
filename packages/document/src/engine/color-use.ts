/* @layer core @kind logic */
import type { ChangeSet } from '../commands/result.type';
import type { Rect } from '../model/geometry.type';
import type { BankId, CelId } from '../model/ids.type';
import type { PaletteBank } from '../model/palette.type';
import type { Cel, Sprite } from '../model/sprite.type';
import { findSprite } from '../read/find-sprite';
import { celTotals } from './cel-totals';
import { COLOR_VALUES } from './color-values.constants';
import type { UseInput } from './color-use.type';
import { deltaTotals } from './delta-totals';
import { totalsCache } from './totals-cache';

const rectsOf = (changes: ChangeSet, sprite: Sprite): Map<CelId, Rect> =>
  new Map(changes.sprites.find((change) => change.id === sprite.id)?.cels.map((change) => [change.celId, change.rect] as const));

const smallChange = (rect: Rect, size: number): boolean => rect.width * rect.height * 2 <= size;

const deltaFor = (sprite: Sprite, cel: Cel, input: UseInput, rects: Map<CelId, Rect>): Int32Array | null => {
  const rect = rects.get(cel.id);
  const prior = findSprite(input.base, sprite.id);
  const before = prior?.cels[cel.id]?.pixels;
  if (!rect || before?.length !== cel.pixels.length || !smallChange(rect, cel.pixels.length)) return null;
  if (prior?.width !== sprite.width || prior.height !== sprite.height) return null;
  return deltaTotals({ before, after: cel.pixels, stride: sprite.width, rect });
};

const totalsFor = (sprite: Sprite, cel: Cel, input: UseInput, rects: Map<CelId, Rect>): Int32Array =>
  totalsCache.get(cel.pixels) ?? deltaFor(sprite, cel, input, rects) ?? celTotals(cel.pixels);

const bankUse = (bank: PaletteBank, input: UseInput): number[] => {
  const sum = new Int32Array(COLOR_VALUES);
  for (const sprite of input.artwork.sprites) {
    if (sprite.bankId !== bank.id) continue;
    const rects = rectsOf(input.changes, sprite);
    for (const cel of Object.values(sprite.cels)) {
      const totals = totalsFor(sprite, cel, input, rects);
      for (let value = 0; value < COLOR_VALUES; value += 1) sum[value] = (sum[value] ?? 0) + (totals[value] ?? 0);
    }
  }
  let length = bank.slots.length;
  for (let value = COLOR_VALUES - 1; value >= length; value -= 1) {
    if ((sum[value] ?? 0) > 0) {
      length = value + 1;
      break;
    }
  }
  return Array.from({ length }, (_, value) => sum[value] ?? 0);
};

const colorUse = (input: UseInput): Record<BankId, number[]> =>
  Object.fromEntries(input.artwork.banks.filter((bank) => input.bankIds.has(bank.id)).map((bank) => [bank.id, bankUse(bank, input)] as const));

export { colorUse };
