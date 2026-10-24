/* @layer renderer-app @kind logic */
import { PATTERN_CELLS, PATTERN_SIZE, SURROUND_RULES } from './canvas-look.constants';
import type { SurroundKind } from './canvas-look.type';
import { cleanBits } from './clean-bits';

const presetBits = (kind: Exclude<SurroundKind, 'custom'>): string => {
  const rule = SURROUND_RULES[kind];
  return Array.from({ length: PATTERN_CELLS }, (_, index) => (rule(index % PATTERN_SIZE, Math.floor(index / PATTERN_SIZE)) ? '1' : '0')).join('');
};

const patternBits = (kind: SurroundKind, custom: unknown): string => (kind === 'custom' ? cleanBits(custom) : presetBits(kind));

export { patternBits };
