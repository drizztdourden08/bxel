/* @layer core @kind logic */
import { entryKindOf } from './entry-kind-of';
import { isListableName } from './is-listable-name';
import type { ListedEntry, Listing, ListOptions, RawEntry } from './listing.type';

const byName = (first: ListedEntry, second: ListedEntry): number =>
  first.name.toLowerCase().localeCompare(second.name.toLowerCase()) || first.name.localeCompare(second.name);

const listedOf = (entry: RawEntry): ListedEntry =>
  entry.kind === 'folder'
    ? { name: entry.name, kind: 'folder' }
    : { name: entry.name, kind: entryKindOf(entry.name), bytes: entry.size, modified: entry.modified };

const wanted = (entry: ListedEntry, options: ListOptions): boolean =>
  entry.kind === 'folder' || options.kinds.includes(entry.kind);

const listEntries = (raw: readonly RawEntry[], options: ListOptions): Listing => {
  const named = raw.filter((entry) => isListableName(entry.name));
  const shown = named.map(listedOf).filter((entry) => wanted(entry, options));
  const folders = shown.filter((entry) => entry.kind === 'folder').sort(byName);
  const files = shown.filter((entry) => entry.kind !== 'folder').sort(byName);
  const ordered = [...folders, ...files];
  const entries = ordered.slice(options.offset, options.offset + options.limit);
  return {
    entries,
    total: ordered.length,
    skipped: raw.length - named.length,
    truncated: options.offset + entries.length < ordered.length,
  };
};

export { listEntries };
