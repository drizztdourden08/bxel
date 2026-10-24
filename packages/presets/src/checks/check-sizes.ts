/* @layer core @kind logic */
import type { PlatformPreset } from '../model/preset.type';
import type { SpriteSize } from '../model/sprite-size.type';
import { checkSprite } from './check-sprite';
import type { RuleFinding } from './finding.type';

const sizeKey = (size: SpriteSize): string => `${String(size.width)}x${String(size.height)}`;

const checkSizes = (preset: PlatformPreset, sizes: readonly SpriteSize[]): readonly RuleFinding[] => {
  const unique = [...new Map(sizes.map((size) => [sizeKey(size), size])).values()];
  return unique.flatMap((size): RuleFinding[] => {
    const result = checkSprite(preset, size);
    if (result.ok) return [];
    const key = sizeKey(size);
    const excess = sizes.filter((other) => sizeKey(other) === key).length;
    return [{ rule: 'spriteSize', tier: preset.tiers.spriteSize, message: result.message, key: `spriteSize:${key}`, excess }];
  });
};

export { checkSizes };
