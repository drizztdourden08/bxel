/* @layer renderer-app @kind hook */
import { commands } from '@drizztdourden08/brock-react';
import { useEffect } from 'react';
import { allPresets } from '../editor/presets/all-presets';
import { presetKeyCommands } from '../keymap/preset-key-commands';
import { useProjectStore } from '../stores/useProjectStore';
import { useToolPresetStore } from '../stores/useToolPresetStore';

const usePresetKeyCommands = (): void => {
  const user = useToolPresetStore((state) => state.user);
  const project = useProjectStore((state) => state.project?.manifest.toolPresets);
  useEffect(() => commands.register(presetKeyCommands(allPresets(user))), [user, project]);
};

export { usePresetKeyCommands };
