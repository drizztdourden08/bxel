/* @layer renderer-app @kind logic */
import { entryName } from '../../../sheet-manager/entry-id';
import { NAME_COLLATOR } from '../../../sheet-manager/manager.constants';
import type { EntryFacts, EntryKind } from '../../../sheet-manager/manager.type';
import { nameMatches } from '../../../sheet-manager/name-matches';

/** The entries that pass the search and the kind chip, sprites first and then animations, each in natural name order. */
const browseEntries = (entries: readonly EntryFacts[], query: string, kind: EntryKind): EntryFacts[] => {
  const kept = entries.filter((fact) => (kind === 'all' || (kind === 'sprites') === (fact.kind === 'sprite')) && nameMatches(entryName(fact), query));
  const byName = (a: EntryFacts, b: EntryFacts): number => NAME_COLLATOR.compare(entryName(a), entryName(b));
  return [...kept.filter((fact) => fact.kind === 'sprite').sort(byName), ...kept.filter((fact) => fact.kind === 'animation').sort(byName)];
};

export { browseEntries };
