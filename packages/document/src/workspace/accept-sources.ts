/* @layer core @kind logic */
import type { IdSource } from '../ids/id-source.type';
import type { AcceptedSource } from './accepted-source.type';
import { applyRekey } from './apply-rekey';
import { definedIds } from './defined-ids';
import { ownedContent } from './owned-content';
import { priorityOrder } from './priority-order';
import { rekeyMap } from './rekey-map';
import type { SliceSource } from './slice-source.type';

const acceptSources = (sources: readonly SliceSource[], ids: IdSource): readonly AcceptedSource[] => {
  const taken = new Set(sources.flatMap((source) => [...definedIds(source.slice.artwork)]));
  const claimed = new Set<string>();
  const accepted: AcceptedSource[] = [];
  for (const index of priorityOrder(sources)) {
    const source = sources[index];
    if (!source) continue;
    const owned = definedIds(ownedContent(source.slice));
    const map = rekeyMap(owned, claimed, ids, taken);
    for (const id of owned) claimed.add(map.get(id) ?? id);
    accepted.push({ index, path: source.path, oldId: source.slice.id, slice: applyRekey(source.slice, map), map });
  }
  return accepted.sort((left, right) => left.index - right.index);
};

export { acceptSources };
