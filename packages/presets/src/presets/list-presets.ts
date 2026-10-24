/* @layer core @kind logic */
import type { PlatformPreset, PresetFamily } from '../model/preset.type';
import { presetCatalog } from './preset-catalog';

const addToFamily = (groups: PresetFamily[], preset: PlatformPreset): PresetFamily[] => {
  const index = groups.findIndex((group) => group.family === preset.family);
  const current = groups[index];
  if (current === undefined) return [...groups, { family: preset.family, presets: [preset] }];
  return groups.map((group) =>
    group === current ? { family: group.family, presets: [...group.presets, preset] } : group,
  );
};

const listPresets = (): readonly PresetFamily[] => presetCatalog().reduce(addToFamily, []);

export { listPresets };
