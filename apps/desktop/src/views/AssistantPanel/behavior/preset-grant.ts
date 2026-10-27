/* @layer renderer-app @kind logic */
import { blockedGrant, PRESETS } from '@bxel/mcp';
import type { Grant } from '@bxel/mcp';
import type { PresetChoice } from './grant-rows.type';

const presetGrant = (choice: PresetChoice): Grant | null => {
  if (choice === 'custom') return null;
  return choice === 'blocked' ? blockedGrant() : PRESETS[choice].grant;
};

export { presetGrant };
