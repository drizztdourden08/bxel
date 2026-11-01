/* @layer renderer-app @kind logic */
import { useProjectStore } from '../../stores/useProjectStore';
import type { ToolPreset } from './tool-preset.type';

const projectPresets = (): ToolPreset[] =>
  (useProjectStore.getState().project?.manifest.toolPresets ?? []).map((preset) => ({ ...preset, fields: { ...preset.fields }, project: true }));

export { projectPresets };
