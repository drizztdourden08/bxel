/* @layer renderer-app @kind logic */
import { hiddenFailure } from '@bxel/mcp';
import { nav } from '@drizztdourden08/brock-react';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { activateTab } from '../../workspace/activate-tab';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { reply } from './reply';
import { viewFail } from './view-fail';
import { viewFor } from './view-for';
import type { ViewStep } from './view-steps.type';

const focusStep: ViewStep = (patch, context) => {
  const { focus } = patch;
  if (!focus) return null;
  const { tabs, activeTab } = useWorkspaceStore.getState();
  const inDocument = tabs.filter((each) => each.documentId === focus.documentId);
  const tab = focus.tabId === undefined ? (inDocument.find((each) => each.id === activeTab) ?? inDocument[0]) : tabs.find((each) => each.id === focus.tabId);
  if (!tab || (focus.documentId !== undefined && tab.documentId !== focus.documentId)) return viewFail(APP_TOOL_TEXT.noTab, 'focus');
  if (viewFor(context, tab.documentId) === null) return reply(hiddenFailure('document'));
  nav.close();
  activateTab(tab.id);
  return null;
};

export { focusStep };
