/* @layer renderer-app @kind logic */
import type { OnionPattern, OnionSide } from './onion.type';

const shapeOf = (pattern: OnionPattern, side: OnionSide): 'dots' | 'lines' | 'none' => {
  if (pattern === 'split') return side === 'before' ? 'dots' : 'lines';
  return pattern;
};

const patternKeeps = (pattern: OnionPattern | undefined, side: OnionSide, at: { x: number; y: number }): boolean => {
  const shape = shapeOf(pattern ?? 'none', side);
  if (shape === 'dots') return (at.x + at.y) % 2 === 0;
  if (shape === 'lines') return at.y % 2 === 0;
  return true;
};

export { patternKeeps };
