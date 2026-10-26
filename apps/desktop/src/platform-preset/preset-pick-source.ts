/* @layer renderer-app @kind logic */
import type { SettingsValueSource } from '@drizztdourden08/brock-react';
import { usePresetPickStore } from '../stores/usePresetPickStore';
import { PRESET_PICK_KEY } from './platform-preset.constants';

const presetPickSource: SettingsValueSource = {
  get: (key) => (key === PRESET_PICK_KEY ? usePresetPickStore.getState().picked : undefined),
  set: (key, value) => {
    if (key === PRESET_PICK_KEY && typeof value === 'string') usePresetPickStore.getState().pick(value);
  },
  subscribe: (listener) => usePresetPickStore.subscribe(listener),
};

export { presetPickSource };
