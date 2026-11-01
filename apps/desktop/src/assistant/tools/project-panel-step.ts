/* @layer renderer-app @kind logic */
import { useProjectPanelLinkStore } from '../../stores/useProjectPanelLinkStore';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { locationPaths } from './location-paths';
import { reply } from './reply';
import { viewFail } from './view-fail';
import type { ViewStep } from './view-steps.type';

const projectPanelStep: ViewStep = (patch, context) => {
  const { projectPanel } = patch;
  if (!projectPanel) return null;
  const { snapshot, send } = useProjectPanelLinkStore.getState();
  if (snapshot === null) return viewFail(APP_TOOL_TEXT.panelOff, 'projectPanel');
  const picked = projectPanel.selection === undefined ? null : locationPaths(context, projectPanel.selection, 'projectPanel.selection');
  if (picked !== null && !picked.ok) return reply(picked);
  send({
    ...(projectPanel.mode === undefined ? {} : { mode: projectPanel.mode }),
    ...(projectPanel.search === undefined ? {} : { text: projectPanel.search }),
    ...(projectPanel.chips === undefined ? {} : { chips: projectPanel.chips }),
    ...(picked === null ? {} : { selection: picked.value }),
  });
  return null;
};

export { projectPanelStep };
