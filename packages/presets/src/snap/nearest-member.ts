/* @layer core @kind logic */
import { colorDistance } from '@bxel/palette';

const nearestMember = (rgb: number, members: readonly number[]): number => {
  let best = rgb;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const candidate of members) {
    const distance = colorDistance(rgb, candidate);
    if (distance < bestDistance) {
      best = candidate;
      bestDistance = distance;
    }
  }
  return best;
};

export { nearestMember };
