/* @layer renderer-app @kind logic */
import { parseHex } from '@bxel/palette';
import { SPHERE } from './palette-ramps.constants';

const shadeAt = (x: number, y: number, size: number): number | null => {
  const centre = (size - 1) / 2;
  const radius = size / 2 - SPHERE.margin;
  const dx = (x - centre) / radius;
  const dy = (y - centre) / radius;
  const flat = dx * dx + dy * dy;
  if (flat > 1) return null;
  const dz = Math.sqrt(1 - flat);
  const lit = dx * SPHERE.light[0] + dy * SPHERE.light[1] + dz * SPHERE.light[2];
  return Math.max(0, Math.min(1, lit));
};

const spherePixels = (colours: readonly string[], size: number): Uint8ClampedArray<ArrayBuffer> => {
  const rgba = new Uint8ClampedArray(size * size * 4);
  const steps = colours.map((hex) => parseHex(hex.slice(0, 7)) ?? 0);
  if (steps.length === 0) return rgba;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const shade = shadeAt(x, y, size);
      if (shade === null) continue;
      const rgb = steps[Math.min(steps.length - 1, Math.floor(shade * steps.length))] ?? 0;
      const at = (y * size + x) * 4;
      rgba.set([(rgb >> 16) & 255, (rgb >> 8) & 255, rgb & 255, 255], at);
    }
  }
  return rgba;
};

export { spherePixels };
