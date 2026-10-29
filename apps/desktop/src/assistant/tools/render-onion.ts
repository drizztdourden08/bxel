/* @layer renderer-app @kind logic */
import { composeAnimationFrame, ERROR_CODE, findBank } from '@bxel/document';
import type { AnimFrameId } from '@bxel/document';
import { encodeBase64, MCP_ERROR_CODE, mcpFailure, RENDER_PNG_BYTES_MAX } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import type { DocumentView } from '../../documents/document-host.type';
import { useTimelineStore } from '../../stores/useTimelineStore';
import { composedRgba } from '../../timeline/composed-rgba';
import { onionPixels } from '../../timeline/onion-pixels';
import type { ToolContext } from '../assistant.type';
import { animationFor } from './animation-for';
import { animationPng } from './animation-png';
import { animationUri } from './animation-uri';
import { blendGhost } from './blend-ghost';
import { hiddenAssets } from './hidden-assets';
import { indexHash } from './index-hash';
import { onionGhostOf } from './onion-ghost-of';
import { onionPlanOf } from './onion-plan-of';
import { reply } from './reply';
import type { AnimationSource, RenderInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const renderOnion = async (context: ToolContext, view: DocumentView, input: RenderInput, source: AnimationSource): Promise<ToolReply> => {
  const { documentId, scale } = input;
  const { artwork, revision } = view.state;
  if (source.frameId === undefined) return reply(mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.onionFrame, { path: 'target.frameId' }));
  const found = animationFor(artwork, source.animationId, hiddenAssets(context, documentId));
  if (!found.ok) return reply(found);
  const animation = found.value;
  const frameId = source.frameId as AnimFrameId;
  const bank = findBank(artwork, animation.bankId);
  const data = composedRgba(artwork, animation, frameId);
  if (!animation.frames.some((frame) => frame.id === frameId) || !data) return reply(mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.noAnimation));
  if (!bank) return reply(mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.onionBank));
  const { onion } = useTimelineStore.getState();
  for (const layer of onionPlanOf(animation, frameId)) {
    blendGhost(data, onionPixels({ artwork, animation, bank }, frameId, onionGhostOf(layer, onion)), layer.alpha);
  }
  const indices = composeAnimationFrame(artwork, animation, frameId);
  const png = animationPng({ image: { data, width: animation.width, height: animation.height }, indices }, scale);
  if (!png.ok) return reply(png);
  if (png.value.bytes.length > RENDER_PNG_BYTES_MAX) return reply(mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, TOOL_TEXT.pngTooLarge));
  return reply(
    {
      ok: true,
      revision,
      width: png.value.width,
      height: png.value.height,
      scale,
      indexHash: await indexHash(indices),
      uri: animationUri(documentId, source, scale, revision),
    },
    [encodeBase64(png.value.bytes)],
  );
};

export { renderOnion };
