/* @layer renderer-app @kind logic */
import { hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import { nav } from '@drizztdourden08/brock-react';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { activateTab } from '../../workspace/activate-tab';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { reply } from './reply';
import { viewFail } from './view-fail';
import type { ViewStep } from './view-steps.type';
import { viewFor } from './view-for';

const focusStep: ViewStep = (patch, context) => {
  const { focus } = patch;
  if (!focus) return null;
  const { tabs, activeTab } = useWorkspaceStore.getState();
  const tab = focus.tabId === undefined ? tabs.find((each) => each.documentId === focus.documentId && each.id === activeTab) ?? tabs.find((each) => each.documentId === focus.documentId) : tabs.find((each) => each.id === focus.tabId);
  if (!tab || (focus.documentId !== undefined && tab.documentId !== focus.documentId)) return viewFail(APP_TOOL_TEXT.noTab, 'focus');
  if (viewFor(context, tab.documentId) === null) return reply(hiddenFailure('document'));
  nav.close();
  activateTab(tab.id);
  return null;
};

const pageStep: ViewStep = (patch) => {
  const { page } = patch;
  if (!page) return null;
  if (!nav.routes().some((route) => route.route === page.route)) return reply(mcpFailure(MCP_ERROR_CODE.VIEW_INVALID, APP_TOOL_TEXT.badRoute(page.route), { path: 'page.route' }));
  nav.open(page.route, page.section === undefined ? undefined : { section: page.section });
  return null;
};

export { focusStep, pageStep };
