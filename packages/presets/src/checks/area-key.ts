/* @layer core @kind logic */
import type { AreaRule, PlatformPreset } from '../model/preset.type';

const areaKey = (preset: PlatformPreset, rule: AreaRule): ((index: number) => number | null) => {
  if (rule.kind === 'maxColoursPerArea') return (index) => index;
  const { size, slot0, slot0Shared } = preset.banks;
  const hidden = slot0 === 'transparent' || slot0Shared;
  return (index) => (hidden && index % size === 0 ? null : Math.floor(index / size));
};

export { areaKey };
