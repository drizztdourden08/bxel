/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import { POINT_PAIR } from './collision.constants';

const parsePoints = (text: string): Point[] | null => {
  const parts = text.split(/[\s;]+/).filter((part) => part !== '');
  const points = parts.flatMap((part) => {
    const match = POINT_PAIR.exec(part);
    return match ? [{ x: Number(match[1]), y: Number(match[2]) }] : [];
  });
  return points.length === parts.length ? points : null;
};

export { parsePoints };
