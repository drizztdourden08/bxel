/* @layer renderer-app @kind logic */
import type { AnimDirection } from '@bxel/document';

const run = (first: number, last: number): number[] => Array.from({ length: Math.max(0, last - first + 1) }, (_, step) => first + step);

const inside = (count: number): number[] => (count > 2 ? run(1, count - 2).reverse() : []);

const playOrder = (count: number, direction: AnimDirection): readonly number[] => {
  if (count <= 0) return [];
  const forward = run(0, count - 1);
  if (direction === 'reverse') return [...forward].reverse();
  if (direction === 'pingpong') return [...forward, ...inside(count)];
  if (direction === 'pingpongReverse') return [...[...forward].reverse(), ...inside(count).reverse()];
  return forward;
};

export { playOrder };
