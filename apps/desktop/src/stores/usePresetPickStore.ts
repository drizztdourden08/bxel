/* @layer renderer-app @kind hook */
import { listPresets } from '@bxel/presets';
import { create } from 'zustand';
import type { PresetPickState } from './preset-pick-store.type';

const usePresetPickStore = create<PresetPickState>()((set) => ({
  picked: listPresets()[0]?.presets[0]?.id ?? '',
  pick: (picked) => set({ picked }),
}));

export { usePresetPickStore };
