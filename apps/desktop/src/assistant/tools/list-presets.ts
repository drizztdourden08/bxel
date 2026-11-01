/* @layer renderer-app @kind logic */
import { allPresets } from '../../editor/presets/all-presets';
import { useToolPresetStore } from '../../stores/useToolPresetStore';
import type { ToolHandler } from '../assistant.type';
import { presetRow } from './preset-row';
import { reply } from './reply';

const listPresets: ToolHandler = (input) => {
  const { member } = input as { member?: string };
  const presets = allPresets(useToolPresetStore.getState().user).filter((preset) => member === undefined || preset.member === member);
  return reply({ ok: true, presets: presets.map(presetRow) });
};

export { listPresets };
