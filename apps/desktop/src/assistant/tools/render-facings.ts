/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import { encodeBase64, MCP_ERROR_CODE, mcpFailure, RENDER_PNG_BYTES_MAX } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import type { DocumentView } from '../../documents/document-host.type';
import type { ToolContext } from '../assistant.type';
import { animationFacings } from './animation-facings';
import { animationFor } from './animation-for';
import { animationPng } from './animation-png';
import { animationSteps } from './animation-steps';
import { animationStrip } from './animation-strip';
import { animationUri } from './animation-uri';
import { FACING_ORDER } from './facing-order.constants';
import { hiddenAssets } from './hidden-assets';
import { indexHash } from './index-hash';
import { reply } from './reply';
import { stackStrips } from './stack-strips';
import type { AnimationSource, AnimationStrip, RenderInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const renderFacings = async (context: ToolContext, view: DocumentView, input: RenderInput, source: AnimationSource): Promise<ToolReply> => {
  const { documentId, scale } = input;
  const { artwork, revision } = view.state;
  if (input.animated !== undefined) return reply(mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.animatedRows, { path: 'animated' }));
  const found = animationFor(artwork, source.animationId, hiddenAssets(context, documentId));
  if (!found.ok) return reply(found);
  const animation = found.value;
  const map = animationFacings(animation);
  const rows = FACING_ORDER.filter((facing) => map[facing] !== undefined).map((facing) => ({ facing, tagId: map[facing] ?? '' }));
  if (rows.length === 0) return reply(mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.noFacings, { path: 'target.allFacings' }));
  const strips: AnimationStrip[] = [];
  for (const row of rows) {
    const steps = animationSteps(animation, { animationId: animation.id, tagId: row.tagId });
    const strip = steps.ok ? animationStrip(artwork, animation, steps.value) : null;
    if (!strip) return reply(steps.ok ? mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, TOOL_TEXT.noAnimation) : steps);
    strips.push(strip);
  }
  const stacked = stackStrips(strips, animation.height);
  const png = animationPng(stacked, scale);
  if (!png.ok) return reply(png);
  if (png.value.bytes.length > RENDER_PNG_BYTES_MAX) return reply(mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, TOOL_TEXT.pngTooLarge));
  return reply(
    {
      ok: true,
      revision,
      width: png.value.width,
      height: png.value.height,
      scale,
      indexHash: await indexHash(stacked.indices),
      uri: animationUri(documentId, { animationId: source.animationId }, scale, revision),
      rows,
    },
    [encodeBase64(png.value.bytes)],
  );
};

export { renderFacings };
