/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { Animation } from '@bxel/document';
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import type { DocumentView } from '../../documents/document-host.type';
import type { ToolContext } from '../assistant.type';
import { animationGif } from './animation-gif';
import { drawnAnimation } from './animation-frames';
import type { DrawnAnimation } from './animation-frames.type';
import { animationPng } from './animation-png';
import type { ExportedAnimation } from './export-animation.type';
import { indexedPng } from './indexed-png';
import { indexHash } from './index-hash';
import type { AnimationSource, AnimationStrip, ExportInput, FramePng } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const rowMajor = (animation: Animation, strip: AnimationStrip): Uint8Array => {
  const { width, height } = animation;
  const count = strip.image.width / width;
  const out = new Uint8Array(strip.indices.length);
  for (let at = 0; at < count; at += 1) {
    for (let row = 0; row < height; row += 1) {
      const from = (at * height + row) * width;
      out.set(strip.indices.subarray(from, from + width), row * width * count + at * width);
    }
  }
  return out;
};

const indexedStrip = (view: DocumentView, animation: Animation, strip: AnimationStrip, scale: number): McpResult<FramePng> => {
  const bank = findBank(view.state.artwork, animation.bankId);
  if (!bank) return mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, TOOL_TEXT.noAnimation);
  return indexedPng({ indices: rowMajor(animation, strip), width: strip.image.width, height: strip.image.height, bank }, scale);
};

const stillStrip = (view: DocumentView, drawn: DrawnAnimation, job: ExportInput): McpResult<FramePng> =>
  job.format === 'png-indexed' ? indexedStrip(view, drawn.animation, drawn.strip, job.scale) : animationPng(drawn.strip, job.scale);

const exportedAnimation = async (context: ToolContext, view: DocumentView, job: ExportInput, source: AnimationSource): Promise<McpResult<ExportedAnimation>> => {
  const drawn = drawnAnimation(context, view.state.artwork, job.documentId, source);
  if (!drawn.ok) return drawn;
  const { animation, steps, strip } = drawn.value;
  const tag = source.tagId === undefined ? undefined : animation.tags.find((each) => each.id === source.tagId);
  const repeat = tag?.kind === 'span' ? tag.repeat : animation.loop.repeat;
  const made = job.format === 'gif' ? animationGif(view.state.artwork, animation, steps, { scale: job.scale, repeat }) : stillStrip(view, drawn.value, job);
  return made.ok ? { ok: true, value: { file: made.value, hash: await indexHash(strip.indices) } } : made;
};

export { exportedAnimation };
