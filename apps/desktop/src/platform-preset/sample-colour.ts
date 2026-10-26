/* @layer renderer-app @kind logic */
import type { SizePair } from '@bxel/presets';

const sampleColour = (x: number, y: number, size: SizePair, colours: readonly string[]): string | null => {
  const [width, height] = size;
  const distance = Math.abs(x + 0.5 - width / 2) / (width / 2) + Math.abs(y + 0.5 - height / 2) / (height / 2);
  if (distance > 1) return null;
  return colours[Math.min(colours.length - 1, Math.floor(distance * colours.length))] ?? null;
};

export { sampleColour };
