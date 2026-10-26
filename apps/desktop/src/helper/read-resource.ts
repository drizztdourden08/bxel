/* @layer helper @kind logic */
import type { ReadResourceResult } from '@modelcontextprotocol/sdk/types.js';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { GUIDE_TEXT, GUIDE_URI } from './guide.constants';
import { HELPER_TEXT } from './helper.constants';
import type { HelperState } from './helper.type';
import { previewRequest } from './preview-request';

const readResource = async (state: HelperState, uri: string): Promise<ReadResourceResult> => {
  if (uri === GUIDE_URI) return { contents: [{ uri, mimeType: 'text/markdown', text: GUIDE_TEXT }] };
  const request = previewRequest(uri);
  if (!request) throw new McpError(ErrorCode.InvalidParams, HELPER_TEXT.notFound(uri));
  const reply = await state.session.call('render_preview', { ...request, background: 'transparent', grid: false });
  const blob = reply.images[0];
  if (!reply.outcome.ok) throw new McpError(ErrorCode.InvalidParams, reply.outcome.error.message);
  if (blob === undefined) throw new McpError(ErrorCode.InvalidParams, HELPER_TEXT.notFound(uri));
  return { contents: [{ uri, mimeType: 'image/png', blob }] };
};

export { readResource };
