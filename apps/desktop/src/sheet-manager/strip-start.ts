/* @layer renderer-app @kind logic */
import type { Sheet, Sprite } from '@bxel/document';
import { STRIP_START } from '../add-frames/add-frames.constants';
import { CUT_STRIP_START } from './compose.constants';
import type { CutStripSpec } from './compose.type';
import { stripHint } from './strip-hint';

/** The cut-strip form for a sprite: the count it looks like, and the swap on when the sprite is on the sheet of the open tab. */
const stripStart = (target: Sprite | null, sheet: Sheet | null): CutStripSpec => {
  const hint = target ? stripHint(target) : null;
  const strip = hint ? { ...STRIP_START, by: 'count' as const, columns: hint.columns, rows: hint.rows } : STRIP_START;
  const onSheet = target !== null && (sheet?.entries.some((entry) => entry.spriteId === target.id) ?? false);
  return { ...CUT_STRIP_START, strip, swap: onSheet };
};

export { stripStart };
