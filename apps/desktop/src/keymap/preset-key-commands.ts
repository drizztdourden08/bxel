/* @layer renderer-app @kind logic */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { applyPreset } from '../editor/presets/apply-preset';
import type { ToolPreset } from '../editor/presets/tool-preset.type';
import { announcePreset } from '../editor/tool-pick/announce-preset';
import { COMMAND_GROUP } from './keymap.constants';
import { TOOL_COMMAND } from './option-command-id.constants';
import { ruled } from './ruled';

const presetKeyCommands = (presets: readonly ToolPreset[]): CommandDef[] =>
  presets
    .filter((preset) => preset.builtin !== true)
    .map((preset) =>
      ruled({
        id: TOOL_COMMAND.presetKey(preset.id),
        label: `Apply preset ${preset.name}`,
        group: COMMAND_GROUP.presets,
        run: () => {
          if (applyPreset(preset)) announcePreset(preset);
        },
      }),
    );

export { presetKeyCommands };
