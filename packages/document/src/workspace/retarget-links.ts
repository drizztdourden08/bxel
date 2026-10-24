/* @layer core @kind logic */
import type { AcceptedSource } from './accepted-source.type';
import { remapIds } from './remap-ids';
import { resolveLinkPath } from './resolve-link-path';

const linkRemap = (item: AcceptedSource, byPath: ReadonlyMap<string, AcceptedSource>): ReadonlyMap<string, string> => {
  const remap = new Map<string, string>();
  for (const link of item.slice.links) {
    const next = byPath.get(resolveLinkPath(item.path, link.path))?.map.get(link.id);
    if (next !== undefined) remap.set(link.id, next);
  }
  return remap;
};

const retargetLinks = (accepted: readonly AcceptedSource[]): readonly AcceptedSource[] => {
  const byPath = new Map(accepted.map((item) => [item.path, item] as const));
  return accepted.map((item) => {
    const remap = linkRemap(item, byPath);
    if (remap.size === 0) return item;
    return { ...item, slice: { ...item.slice, artwork: remapIds(item.slice.artwork, remap) } };
  });
};

export { retargetLinks };
