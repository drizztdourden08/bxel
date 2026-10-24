/* @layer core @kind logic */
import type { FrameId, TagId } from '@bxel/document';
import { celAt } from './cel-at';
import { celCopier } from './cel-copier';
import type { MergeSource, SpriteParts } from './compose.type';
import { mergeLayers } from './merge-layers';
import { paddedPixels } from './padded-pixels';

const appendSource = (input: MergeSource, parts: SpriteParts): void => {
  const { ids, source, frame } = input;
  const slots = mergeLayers(ids, parts.layers, source.layers);
  const copy = celCopier(ids, parts.cels);
  const start = parts.frames.length;
  for (const original of source.frames) {
    const made = { id: ids.next('frm') as FrameId, durationMs: original.durationMs };
    parts.frames.push(made);
    source.layers.forEach((layer, at) => {
      const cel = celAt(source, layer, original.id);
      const target = parts.layers[slots[at] ?? 0];
      if (cel && target) target.cels[made.id] = copy(cel.id, () => paddedPixels(source, cel, frame));
    });
  }
  const first = parts.frames[start];
  const last = parts.frames.at(-1);
  if (source.frames.length > 1 && first && last) {
    parts.tags.push({ id: ids.next('tag') as TagId, name: source.name, from: first.id, to: last.id, direction: 'forward', repeat: 0 });
  }
};

export { appendSource };
