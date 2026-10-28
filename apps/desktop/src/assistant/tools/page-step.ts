/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import { nav } from '@drizztdourden08/brock-react';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { reply } from './reply';
import type { ViewStep } from './view-steps.type';

const pageStep: ViewStep = (patch) => {
  const { page } = patch;
  if (!page) return null;
  if (!nav.routes().some((route) => route.route === page.route)) {
    return reply(mcpFailure(MCP_ERROR_CODE.VIEW_INVALID, APP_TOOL_TEXT.badRoute(page.route), { path: 'page.route' }));
  }
  nav.open(page.route, page.section === undefined ? undefined : { section: page.section });
  return null;
};

export { pageStep };
