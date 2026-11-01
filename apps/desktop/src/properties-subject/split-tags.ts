/* @layer renderer-app @kind logic */
import type { ManyItem, TagSplit } from './many-subject.type';

const splitTags = (items: readonly ManyItem[], tagsOf: Readonly<Record<string, readonly string[]>>): TagSplit => {
  const taggable = items.filter((item) => item.assetId !== null);
  const counts = new Map<string, number>();
  for (const item of taggable) for (const tag of new Set(tagsOf[item.assetId ?? ''] ?? [])) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  const all = [...counts].sort(([a], [b]) => a.localeCompare(b));
  return {
    shared: all.filter(([, count]) => count === taggable.length).map(([tag]) => tag),
    partial: all.filter(([, count]) => count !== taggable.length).map(([tag]) => tag),
  };
};

export { splitTags };
