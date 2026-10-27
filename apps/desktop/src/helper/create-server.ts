/* @layer helper @kind logic */
import { describeTools } from '@bxel/mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { APP_COMMANDS } from '../documents/document-host.constants';
import { callTool } from './call-tool';
import { GUIDE_URI } from './guide.constants';
import { ANIMATION_PREVIEW_TEMPLATE, HELPER_INFO, HELPER_TEXT, PREVIEW_TEMPLATE, SHEET_PREVIEW_TEMPLATE } from './helper.constants';
import { helperLog } from './helper-log';
import type { HelperState } from './helper.type';
import { readResource } from './read-resource';

const createServer = (state: HelperState): McpServer => {
  const mcp = new McpServer(HELPER_INFO, { capabilities: { tools: {}, resources: {} }, instructions: HELPER_TEXT.instructions });
  const { server } = mcp;
  const tools = describeTools(APP_COMMANDS);
  server.setRequestHandler(ListToolsRequestSchema, () => ({ tools: [...tools] }));
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const client = server.getClientVersion();
    state.session.setClient({ name: client?.name ?? null, version: client?.version ?? null });
    const started = Date.now();
    const result = await callTool(state, request.params.name, request.params.arguments);
    helperLog(`${request.params.name} ${result.isError ? 'failed' : 'ok'} in ${Date.now() - started} ms`);
    return result;
  });
  server.setRequestHandler(ListResourcesRequestSchema, () => ({
    resources: [{ uri: GUIDE_URI, name: 'Bxel guide', mimeType: 'text/markdown' }],
  }));
  server.setRequestHandler(ListResourceTemplatesRequestSchema, () => ({
    resourceTemplates: [
      { uriTemplate: PREVIEW_TEMPLATE, name: 'Sprite frame preview', mimeType: 'image/png' },
      { uriTemplate: ANIMATION_PREVIEW_TEMPLATE, name: 'Animation preview', mimeType: 'image/png' },
      { uriTemplate: SHEET_PREVIEW_TEMPLATE, name: 'Sheet preview', mimeType: 'image/png' },
    ],
  }));
  server.setRequestHandler(ReadResourceRequestSchema, (request) => readResource(state, request.params.uri));
  return mcp;
};

export { createServer };
