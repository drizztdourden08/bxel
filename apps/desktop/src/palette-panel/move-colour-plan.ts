/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import { colourSpan } from './colour-span';
import { hexesOf } from './hexes-of';
import { lookAt } from './look-at';
import { movedLooks } from './moved-looks';
import { RECOLOUR_TEXT } from './palette-panel.constants';
import type { SheetPlan } from './palette-panel.type';
import { planOf } from './plan-of';
import type { Look } from './recolour-plan.type';
import { updateStep } from './update-step';
import { validSwatch } from './valid-swatch';

const moveColourPlan = (bank: PaletteBank, from: number, to: number): SheetPlan => {
  const ok = from !== to && validSwatch(bank, from) && validSwatch(bank, to);
  const looks = ok ? movedLooks(bank, from, to) : new Map<number, Look>();
  const range = colourSpan(from, to);
  const steps = [...looks].flatMap(([index, look]) => (lookAt(bank, index)?.rgb === look.rgb && lookAt(bank, index)?.alpha === look.alpha ? [] : updateStep(bank, index, look)));
  const after = range.map((index) => looks.get(index)?.rgb.toUpperCase() ?? hexesOf(bank, [index])[0] ?? '');
  return planOf(bank, range, {
    title: RECOLOUR_TEXT.moveTitle,
    note: ok ? RECOLOUR_TEXT.moveNote(from, to) : RECOLOUR_TEXT.moveNone,
    label: RECOLOUR_TEXT.moveLabel,
    done: RECOLOUR_TEXT.moveDone(from, to),
    steps: ok ? steps : [],
    after: ok ? after : [],
  });
};

export { moveColourPlan };
