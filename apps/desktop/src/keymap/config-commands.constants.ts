/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { ASSET_SETTINGS_COMMAND } from '../config-entry/config-entry.constants';
import { openAssetSettings } from '../config-entry/open-asset-settings';

const CONFIG_COMMANDS: readonly CommandDef[] = [
  {
    id: ASSET_SETTINGS_COMMAND,
    label: 'Asset settings',
    icon: 'settings',
    group: 'File',
    chord: 'Alt+Enter',
    run: () => openAssetSettings(),
  },
];

export { CONFIG_COMMANDS };
