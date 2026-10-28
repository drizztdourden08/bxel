/* @layer renderer-app @kind logic */
import type { SurfaceKind, ToolSettings } from '../../stores/tool-store.type';
import { switchTool } from '../switch-tool';

const enterSurfaceChange = (settings: ToolSettings, kind: SurfaceKind, empty: boolean): Partial<ToolSettings> => {
  if (empty || kind === settings.activeSurface) return {};
  const surfaceTools = { ...settings.surfaceTools, [settings.activeSurface]: settings.tool };
  const moved = switchTool(settings, surfaceTools[kind]);
  return { ...moved, activeSurface: kind, surfaceTools, previousTool: null };
};

export { enterSurfaceChange };
