/* @layer renderer-app @kind logic */
import type { PlatformPreset, SizePair, SpriteSizeRule } from '@bxel/presets';
import { PREVIEW_MAX_SIZES, PREVIEW_STEP_LIMIT } from './preset-facts.constants';

const stepSizes = (rule: Extract<SpriteSizeRule, { kind: 'steps' }>): SizePair[] => {
  const sizes: SizePair[] = [];
  const limitW = Math.min(rule.maxW, PREVIEW_STEP_LIMIT);
  const limitH = Math.min(rule.maxH, PREVIEW_STEP_LIMIT);
  for (let step = 1; step * rule.stepW <= limitW && step * rule.stepH <= limitH; step += 1) sizes.push([step * rule.stepW, step * rule.stepH]);
  return sizes;
};

const ruleSizes = (rule: SpriteSizeRule): SizePair[] => {
  switch (rule.kind) {
    case 'list':
      return [...rule.sizes];
    case 'groups':
      return rule.groups.flat();
    case 'steps':
      return stepSizes(rule);
    case 'any':
      return [];
  }
};

const unique = (sizes: readonly SizePair[]): SizePair[] =>
  sizes.filter((size, at) => sizes.findIndex((other) => other[0] === size[0] && other[1] === size[1]) === at);

const spread = (sizes: readonly SizePair[]): SizePair[] => {
  if (sizes.length <= PREVIEW_MAX_SIZES) return [...sizes];
  return Array.from({ length: PREVIEW_MAX_SIZES }, (_, at) => sizes[Math.round((at * (sizes.length - 1)) / (PREVIEW_MAX_SIZES - 1))] as SizePair);
};

const previewSizes = (preset: PlatformPreset): SizePair[] => {
  const all = unique([preset.sizes.canvasDefault, ...ruleSizes(preset.sizes.sprites)]);
  return spread(all.sort((a, b) => a[0] * a[1] - b[0] * b[1]));
};

export { previewSizes };
