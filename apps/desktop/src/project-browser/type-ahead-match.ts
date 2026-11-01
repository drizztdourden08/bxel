/* @layer renderer-app @kind logic */
import { entryName } from './entry-name';
import type { BrowserEntry } from './project-browser.type';

const repeated = (query: string): boolean => query.length > 1 && [...query].every((letter) => letter === query[0]);

const typeAheadMatch = (entries: readonly BrowserEntry[], query: string, current: string | null): BrowserEntry | undefined => {
  const wanted = (repeated(query) ? query.slice(0, 1) : query).toLowerCase();
  if (wanted === '') return undefined;
  const hits = entries.filter((entry) => entryName(entry).toLowerCase().startsWith(wanted));
  if (!repeated(query) && query.length > 1) return hits[0];
  const at = hits.findIndex((entry) => entry.id === current);
  return hits[(at + 1) % Math.max(hits.length, 1)];
};

export { typeAheadMatch };
