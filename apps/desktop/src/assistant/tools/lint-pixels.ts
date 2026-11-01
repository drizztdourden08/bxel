/* @layer renderer-app @kind logic */
import { flattenFrame } from '@bxel/document';
import { lintPixels as lint } from '@bxel/raster';
import type { LintRule } from '@bxel/raster';
import type { ToolHandler } from '../assistant.type';
import { documentFrame } from './document-frame';
import { isReply } from './is-reply';
import { reply } from './reply';
import type { LintInput } from './tool-input.type';

const lintPixels: ToolHandler = (input, context) => {
  const { documentId, spriteId, frameId, rules, limit } = input as LintInput;
  const found = documentFrame(context, documentId, spriteId, frameId);
  if (isReply(found)) return found;
  const { view, sprite, frameId: frame } = found;
  const result = lint({ pixels: flattenFrame(sprite, frame), width: sprite.width, height: sprite.height, rules: rules as readonly LintRule[] | undefined, limit });
  return reply({ ok: true, revision: view.state.revision, spriteId: sprite.id, frameId: frame, total: result.total, findings: result.findings });
};

export { lintPixels };
