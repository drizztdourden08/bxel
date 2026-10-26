/* @layer helper @kind logic */
import type { ReadResourceResult } from '@modelcontextprotocol/sdk/types.js';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { GUIDE_TEXT, GUIDE_URI } from './guide.constants';
import { ANIMATION_PREVIEW_URI, HELPER_TEXT, PREVIEW_URI } from './helper.constants';
import type { HelperState } from './helper.type';

const readResource = async (state: HelperState, uri: string): Promise<ReadResourceResult> => {
  if (uri === GUIDE_URI) return { contents: [{ uri, mimeType: 'text/markdown', text: GUIDE_TEXT }] };
  const animation = ANIMATION_PREVIEW_URI.exec(uri);
  const match = PREVIEW_URI.exec(uri);
  if (!match && !animation) throw new McpError(ErrorCode.InvalidParams, HELPER_TEXT.notFound(uri));
  const [, documentId, spriteId, frameId, spriteScale] = match ?? [];
  const [, animationDocument, animationId, animFrameId, tagId, animationScale] = animation ?? [];
  const scale = animation ? animationScale : spriteScale;
  const reply = await state.session.call('render_preview', {
    documentId: animation ? animationDocument : documentId,
    target: animation ? { animationId, ...(animFrameId === undefined ? {} : { frameId: animFrameId }), ...(tagId === undefined ? {} : { tagId }) } : { spriteId, frameId },
    scale: Number(scale ?? '4'),
    background: 'transparent',
    grid: false,
  });
  const blob = reply.images[0];
  if (!reply.outcome.ok) throw new McpError(ErrorCode.InvalidParams, reply.outcome.error.message);
  if (blob === undefined) throw new McpError(ErrorCode.InvalidParams, HELPER_TEXT.notFound(uri));
  return { contents: [{ uri, mimeType: 'image/png', blob }] };
};

export { readResource };
