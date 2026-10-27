/* @layer renderer-app @kind constants */
import { PRESET_IDS, PRESETS } from '@bxel/mcp';
import { GRANT_TEXT_UI } from './ProgramGrant.constants';

const PRESET_CHOICES = [
  ...PRESET_IDS.map((id) => ({ value: id, label: PRESETS[id].label, description: PRESETS[id].description })),
  { value: 'custom', label: GRANT_TEXT_UI.customLabel, description: undefined, disabled: GRANT_TEXT_UI.customReason },
  { value: 'blocked', label: GRANT_TEXT_UI.blockedLabel, description: undefined },
];

export { PRESET_CHOICES };
