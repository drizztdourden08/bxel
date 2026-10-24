/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';

const pointsText = (points: readonly Point[]): string => points.map((point) => `${point.x},${point.y}`).join(' ');

export { pointsText };
