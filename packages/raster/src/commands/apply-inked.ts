/* @layer core @kind logic */
import { ERROR_CODE, fail, requireBank, requireSprite } from '@bxel/document';
import type { Artwork, ResolvedCel } from '@bxel/document';
import { SHADING_KINDS } from '../ink/ink.constants';
import { inkRule } from '../ink/ink-rule';
import { inkTable } from '../ink/ink-table';
import type { Ink } from '../ink/ink.type';
import { applyToCels } from './apply-to-cels';
import { savedBrushPatch } from './saved-brush-patch';
import type { InkedOperate, InkedRun } from './ink-run.type';
import { targetIssue } from './target-issue';
import { uniqueCels } from './unique-cels';

const tableOf = (artwork: Artwork, cel: ResolvedCel, ink: Ink): Uint8Array => {
  const table = inkTable(requireBank(artwork, requireSprite(artwork, cel.spriteId).bankId), ink);
  if (!table) {
    throw fail(ERROR_CODE.TARGET_NOT_FOUND, 'The ink names a ramp that does not exist in every target palette.', {
      details: [targetIssue(cel.spriteId, 'the palette has no such ramp')],
    });
  }
  return table;
};

const brushOf = (ink: Ink | undefined): string | undefined => (ink?.kind === 'pattern' || ink?.kind === 'dither' ? ink.brushId : undefined);

const applyInked = ({ draft, cels, ink }: InkedRun, operate: InkedOperate): void => {
  const shading = ink !== undefined && SHADING_KINDS.has(ink.kind);
  for (const cel of uniqueCels(cels)) {
    const patch = brushOf(ink) === undefined ? null : savedBrushPatch(draft.artwork, brushOf(ink) ?? '');
    const rule = inkRule(ink, shading ? tableOf(draft.artwork, cel, ink) : null, patch);
    applyToCels(draft, [cel], (target) => operate(target, rule, cel));
  }
};

export { applyInked };
