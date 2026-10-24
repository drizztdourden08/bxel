/* @layer renderer-app @kind logic */
import type { Frame } from '@bxel/document';
import type { Target } from './export.type';

const playOrder = (target: Target): Frame[] => {
  const forward = [...target.frames];
  const direction = target.tag?.direction ?? 'forward';
  if (direction === 'reverse') return forward.reverse();
  if (direction === 'pingpong' && forward.length > 2) return [...forward, ...forward.slice(1, -1).reverse()];
  return forward;
};

export { playOrder };
