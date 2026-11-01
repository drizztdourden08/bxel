/* @layer renderer-app @kind logic */
import { flattenFrame } from '@bxel/document';
import { hiddenFailure } from '@bxel/mcp';
import { lintPixels as lint } from '@bxel/raster';
import type { LintRule } from '@bxel/raster';
import type { ToolHandler } from '../assistant.type';
import { hiddenAssets } from './hidden-assets';
import { reply } from './reply';
import { spriteFrame } from './sprite-frame';
import type { LintInput } from './tool-input.type';
import { viewFor } from './view-for';

const lintPixels: ToolHandler = (input, context) => {
  const { documentId, spriteId, frameId, rules, limit } = input as LintInput;
  const view = viewFor(context, documentId);
  if (!view) return reply(hiddenFailure('document'));
  const found = spriteFrame(view.state.artwork, spriteId, frameId, hiddenAssets(context, documentId));
  if (!found.ok) return reply(found);
  const { sprite, frameId: frame } = found.value;
  const result = lint({ pixels: flattenFrame(sprite, frame), width: sprite.width, height: sprite.height, rules: rules as readonly LintRule[] | undefined, limit });
  return reply({ ok: true, revision: view.state.revision, spriteId: sprite.id, frameId: frame, total: result.total, findings: result.findings });
};

export { lintPixels };
