/* @layer renderer-app @kind logic */
import { BUNDLE_IDS, PRESET_IDS, PRESETS } from '@bxel/mcp';
import type { Grant } from '@bxel/mcp';
import type { PresetChoice } from './grant-rows.type';

const sameLevels = (grant: Grant, other: Grant): boolean => BUNDLE_IDS.every((id) => grant.bundles[id] === other.bundles[id]);

const presetOf = (grant: Grant): PresetChoice => {
  if (grant.blocked) return 'blocked';
  if (Object.keys(grant.tools).length > 0) return 'custom';
  return PRESET_IDS.find((id) => sameLevels(grant, PRESETS[id].grant)) ?? 'custom';
};

export { presetOf };
