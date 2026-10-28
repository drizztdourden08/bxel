/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, Point, Sheet, SpriteId } from '@bxel/document';
import { stripGrid } from '../add-frames/strip-grid';
import { spritesTarget } from '../sheet/sprites-target';
import { TIMELINE_REF } from '../timeline/timeline.constants';
import type { CutStripSpec } from './compose.type';

interface StripPlace {
  sheet: Sheet;
  at: Point;
}

const swapSteps = (sprite: SpriteId, place: StripPlace): CommandStep[] => [
  {
    name: COMMAND_NAME.sheetAnimationAdd,
    targets: null,
    options: { sheet: place.sheet.id, animation: { ref: TIMELINE_REF.animation }, tag: null, ...(place.sheet.layout.kind === 'manual' ? { at: place.at } : {}) },
  },
  { name: COMMAND_NAME.sheetRemove, targets: spritesTarget([sprite]), options: { sheet: place.sheet.id } },
];

const cutStripSteps = (sprite: SpriteId, name: string, spec: CutStripSpec, place: StripPlace | null = null): CommandStep[] => {
  const source = { kind: 'strip', sprite, grid: stripGrid(spec.strip), durationMs: spec.durationMs };
  const create = { name: COMMAND_NAME.animationCreate, targets: null, options: { name, source }, ref: TIMELINE_REF.animation };
  const split = spec.result === 'cells' ? [] : [{ name: COMMAND_NAME.animationSplit, targets: null, options: { animation: { ref: TIMELINE_REF.animation } } }];
  return [create, ...split, ...(spec.swap && place ? swapSteps(sprite, place) : [])];
};

export type { StripPlace };
export { cutStripSteps };
