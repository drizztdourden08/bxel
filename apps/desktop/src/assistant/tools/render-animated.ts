/* @layer renderer-app @kind logic */
import { animationSequence, ERROR_CODE } from '@bxel/document';
import type { TagId } from '@bxel/document';
import { encodeBase64, MCP_ERROR_CODE, mcpFailure, RENDER_PNG_BYTES_MAX } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import type { DocumentView } from '../../documents/document-host.type';
import type { ToolContext } from '../assistant.type';
import { animationApng } from './animation-apng';
import { drawnAnimation } from './animation-frames';
import { animationGif } from './animation-gif';
import { animationUri } from './animation-uri';
import { indexHash } from './index-hash';
import { ANIMATED_MIME } from './render-animated.constants';
import { reply } from './reply';
import type { AnimationSource, RenderInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const renderAnimated = async (context: ToolContext, view: DocumentView, input: RenderInput, source: AnimationSource): Promise<ToolReply> => {
  const { documentId, scale, animated } = input;
  if (animated === undefined) return reply(mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.formatMissing, { path: 'animated' }));
  if (source.frameId !== undefined) return reply(mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.animatedStill, { path: 'target' }));
  const { artwork, revision } = view.state;
  const drawn = drawnAnimation(context, artwork, documentId, source);
  if (!drawn.ok) return reply(drawn);
  const { animation, steps, strip } = drawn.value;
  const { repeat } = animationSequence(animation, (source.tagId ?? null) as TagId | null);
  const made = (animated === 'gif' ? animationGif : animationApng)(artwork, animation, steps, { scale, repeat });
  if (!made.ok) return reply(made);
  if (made.value.bytes.length > RENDER_PNG_BYTES_MAX) return reply(mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, TOOL_TEXT.pngTooLarge));
  return reply(
    {
      ok: true,
      revision,
      width: made.value.width,
      height: made.value.height,
      scale,
      indexHash: await indexHash(strip.indices),
      uri: animationUri(documentId, source, scale, revision),
      mimeType: ANIMATED_MIME[animated],
      frames: steps.length,
      totalMs: steps.reduce((total, step) => total + step.durationMs, 0),
    },
    [encodeBase64(made.value.bytes)],
  );
};

export { renderAnimated };
