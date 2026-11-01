/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import { hexesOf } from './hexes-of';
import { lookAt } from './look-at';
import { RECOLOUR_TEXT } from './palette-panel.constants';
import type { SheetPlan } from './palette-panel.type';
import { planOf } from './plan-of';
import { updateStep } from './update-step';
import { validSwatch } from './valid-swatch';

const copyOverPlan = (bank: PaletteBank, from: number, to: number): SheetPlan => {
  const look = lookAt(bank, from);
  const ok = look !== null && from !== to && validSwatch(bank, to);
  return planOf(bank, [from, to], {
    title: RECOLOUR_TEXT.copyTitle,
    note: ok ? RECOLOUR_TEXT.copyNote(from, to) : RECOLOUR_TEXT.copyNone,
    label: RECOLOUR_TEXT.copyLabel,
    done: RECOLOUR_TEXT.copyDone(to),
    steps: ok ? updateStep(bank, to, look) : [],
    after: ok ? [...hexesOf(bank, [from]), ...hexesOf(bank, [from])] : [],
  });
};

export { copyOverPlan };
