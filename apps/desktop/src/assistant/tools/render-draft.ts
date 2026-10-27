/* @layer renderer-app @kind logic */
import type { TransactionOk } from '@bxel/document';
import { encodeBase64, PREVIEW_RENDER_FRAMES_MAX, RENDER_PNG_BYTES_MAX } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import { framePng } from './frame-png';
import { hiddenAssets } from './hidden-assets';
import type { Shown } from './render-draft.type';
import { spriteFrame } from './sprite-frame';

const shownFrames = (result: TransactionOk): readonly Shown[] => {
  const seen = new Set<string>();
  const found: Shown[] = [];
  for (const change of result.changes.sprites) {
    if (change.kind === 'removed') continue;
    const frames = change.cels.length === 0 ? [undefined] : change.cels.map((cel) => cel.frameId);
    for (const frameId of frames) {
      const key = `${change.id}:${frameId ?? ''}`;
      if (seen.has(key)) continue;
      seen.add(key);
      found.push({ spriteId: change.id, frameId });
    }
  }
  return found.slice(0, PREVIEW_RENDER_FRAMES_MAX);
};

const renderDraft = (context: ToolContext, documentId: string, result: TransactionOk, scale: number): readonly string[] => {
  if (!result.draft) return [];
  const { draft } = result;
  const hidden = hiddenAssets(context, documentId);
  return shownFrames(result).flatMap(({ spriteId, frameId }) => {
    const frame = spriteFrame(draft, spriteId, frameId, hidden);
    if (!frame.ok) return [];
    const png = framePng(frame.value, scale);
    return png.ok && png.value.bytes.length <= RENDER_PNG_BYTES_MAX ? [encodeBase64(png.value.bytes)] : [];
  });
};

export { renderDraft };
