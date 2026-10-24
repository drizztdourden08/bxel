/* @layer renderer-app @kind logic */
import { MISMATCH_TEXT } from './sheet.constants';
import type { BroadcastCheck } from './sheet.type';

const reasonText = (check: BroadcastCheck): string => {
  const sizes = check.gaps.some((gap) => gap.reason === 'size');
  const palettes = check.gaps.some((gap) => gap.reason === 'palette');
  if (sizes && palettes) return MISMATCH_TEXT.both;
  return sizes ? MISMATCH_TEXT.sizes : MISMATCH_TEXT.palettes;
};

const mismatchText = (check: BroadcastCheck, layerName: string): string => {
  const bad = check.gaps.length;
  if (check.gaps.every((gap) => gap.reason === 'layer')) return MISMATCH_TEXT.layers(bad, check.total, layerName);
  return MISMATCH_TEXT.others(bad, check.total, reasonText(check));
};

export { mismatchText };
