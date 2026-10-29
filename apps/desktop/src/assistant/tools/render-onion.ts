/* @layer renderer-app @kind logic */
import { composeAnimationFrame, ERROR_CODE, findBank } from '@bxel/document';
import type { AnimFrameId } from '@bxel/document';
import { mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import type { DocumentView } from '../../documents/document-host.type';
import { useTimelineStore } from '../../stores/useTimelineStore';
import { composedRgba } from '../../timeline/composed-rgba';
import { onionGhostOf } from '../../timeline/onion-ghost-of';
import { onionPixels } from '../../timeline/onion-pixels';
import type { ToolContext } from '../assistant.type';
import { animationFor } from './animation-for';
import { animationPng } from './animation-png';
import { animationUri } from './animation-uri';
import { blendGhost } from './blend-ghost';
import { hiddenAssets } from './hidden-assets';
import { onionPlanOf } from './onion-plan-of';
import { pngReply } from './png-reply';
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
  return pngReply(png, { revision, scale, uri: animationUri(documentId, source, scale, revision) });
};

export { renderOnion };
