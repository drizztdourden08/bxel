/* @layer renderer-app @kind logic */
import { useToolStore } from '../../stores/useToolStore';
import { TOOL_OPTION_SETTERS } from './tool-options.constants';
import type { ViewStep } from './view-steps.type';

const toolStep: ViewStep = (patch) => {
  const { tool } = patch;
  if (!tool) return null;
  const store = useToolStore.getState();
  if (tool.id !== undefined) store.selectTool(tool.id);
  const { options } = tool;
  if (options) for (const set of TOOL_OPTION_SETTERS) set(store, options);
  return null;
};

export { toolStep };
