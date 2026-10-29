/* @layer renderer-app @kind logic */
import type { Sheet, Sprite } from '@bxel/document';
import { STRIP_START } from '../add-frames/add-frames.constants';
import { CUT_STRIP_START } from './compose.constants';
import type { CutStripSpec } from './compose.type';
import { spriteOnSheet } from './sprite-on-sheet';
import { stripHint } from './strip-hint';

const stripStart = (target: Sprite | null, sheet: Sheet | null): CutStripSpec => {
  const hint = target ? stripHint(target) : null;
  const strip = hint ? { ...STRIP_START, by: 'count' as const, columns: hint.columns, rows: hint.rows } : STRIP_START;
  return { ...CUT_STRIP_START, strip, swap: spriteOnSheet(target, sheet) };
};

export { stripStart };
