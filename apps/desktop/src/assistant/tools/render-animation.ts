/* @layer renderer-app @kind logic */
import { encodeBase64, MCP_ERROR_CODE, mcpFailure, RENDER_PNG_BYTES_MAX } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import type { DocumentView } from '../../documents/document-host.type';
import type { ToolContext } from '../assistant.type';
import { animationFor } from './animation-for';
import { animationPng } from './animation-png';
import { animationUri } from './animation-uri';
import { drawnAnimation } from './animation-frames';
import { facingSource } from './facing-source';
import { hiddenAssets } from './hidden-assets';
import { indexHash } from './index-hash';
import { renderAnimated } from './render-animated';
import { renderFacings } from './render-facings';
import { renderOnion } from './render-onion';
import { reply } from './reply';
import type { AnimationSource, RenderInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const renderStrip = async (context: ToolContext, view: DocumentView, input: RenderInput, source: AnimationSource): Promise<ToolReply> => {
  const { documentId, scale } = input;
  const drawn = drawnAnimation(context, view.state.artwork, documentId, source);
  if (!drawn.ok) return reply(drawn);
  const png = animationPng(drawn.value.strip, scale);
  if (!png.ok) return reply(png);
  if (png.value.bytes.length > RENDER_PNG_BYTES_MAX) return reply(mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, TOOL_TEXT.pngTooLarge));
  const { revision } = view.state;
  return reply(
    {
      ok: true,
      revision,
      width: png.value.width,
      height: png.value.height,
      scale,
      indexHash: await indexHash(drawn.value.strip.indices),
      uri: animationUri(documentId, source, scale, revision),
    },
    [encodeBase64(png.value.bytes)],
  );
};

const renderAnimation = async (context: ToolContext, view: DocumentView, input: RenderInput, target: AnimationSource): Promise<ToolReply> => {
  const found = animationFor(view.state.artwork, target.animationId, hiddenAssets(context, input.documentId));
  if (!found.ok) return reply(found);
  if (target.allFacings === true) return renderFacings(context, view, input, target);
  const resolved = facingSource(found.value, target);
  if (!resolved.ok) return reply(resolved);
  if (input.onion === true) return renderOnion(context, view, input, resolved.value);
  if (input.animated !== undefined) return renderAnimated(context, view, input, resolved.value);
  return renderStrip(context, view, input, resolved.value);
};

export { renderAnimation };
