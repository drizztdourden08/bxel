/* @layer core @kind logic */
import type { Box } from '../pixels/box.type';
import { readIntegers } from './read-integers';

const readJsonBox = (value: unknown): Box | undefined => {
  const numbers = readIntegers(value, ['x', 'y', 'w', 'h']);
  if (!numbers) return undefined;
  const [x = 0, y = 0, width = 0, height = 0] = numbers;
  return { x, y, width, height };
};

export { readJsonBox };
