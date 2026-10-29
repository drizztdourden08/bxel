/* @layer core @kind logic */
import type { Ink } from '../ink/ink.type';

const inkIndex = (ink: Ink | undefined): number => {
  if (ink?.kind === 'onlyColour') return ink.index;
  return ink?.kind === 'dither' ? ink.second : 0;
};

const withInkIndex = (index: number, ink: Ink | undefined): number => Math.max(index, inkIndex(ink));

export { withInkIndex };
