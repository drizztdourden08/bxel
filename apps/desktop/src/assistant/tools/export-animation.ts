/* @layer renderer-app @kind logic */
import type { McpResult } from '@bxel/mcp';
import type { DocumentView } from '../../documents/document-host.type';
import type { ToolContext } from '../assistant.type';
import { animationGif } from './animation-gif';
import { drawnAnimation } from './animation-frames';
import { animationPng } from './animation-png';
import type { ExportedAnimation } from './export-animation.type';
import { indexHash } from './index-hash';
import type { AnimationSource, ExportInput } from './tool-input.type';

const exportedAnimation = async (context: ToolContext, view: DocumentView, job: ExportInput, source: AnimationSource): Promise<McpResult<ExportedAnimation>> => {
  const drawn = drawnAnimation(context, view.state.artwork, job.documentId, source);
  if (!drawn.ok) return drawn;
  const { animation, steps, strip } = drawn.value;
  const tag = source.tagId === undefined ? undefined : animation.tags.find((each) => each.id === source.tagId);
  const repeat = tag?.kind === 'span' ? tag.repeat : animation.loop.repeat;
  const made = job.format === 'gif' ? animationGif(view.state.artwork, animation, steps, { scale: job.scale, repeat }) : animationPng(strip, job.scale);
  return made.ok ? { ok: true, value: { file: made.value, hash: await indexHash(strip.indices) } } : made;
};

export { exportedAnimation };
