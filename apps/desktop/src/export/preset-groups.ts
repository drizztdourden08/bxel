/* @layer renderer-app @kind logic */
import type { PresetEntry } from './preset-entry.type';
import type { PresetGroup } from './preset-group.type';
import { PRESET_GROUPS } from './preset-list.constants';

const presetGroups = (entries: readonly PresetEntry[]): PresetGroup[] =>
  PRESET_GROUPS.flatMap(({ origin, label }) => {
    const options = entries.filter((entry) => entry.origin === origin).map((entry) => ({ value: entry.key, label: entry.name }));
    return options.length === 0 ? [] : [{ label, options }];
  });

export { presetGroups };
