/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import { pivotLabel } from './pivot-label';

const pivotSummary = (sprites: readonly Sprite[], mixed: string): string => {
  const labels = new Set(sprites.map(pivotLabel));
  if (labels.size === 0) return '';
  return labels.size === 1 ? ([...labels][0] ?? '') : mixed;
};

export { pivotSummary };
