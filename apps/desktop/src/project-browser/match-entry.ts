/* @layer renderer-app @kind logic */
import { KIND_LABEL } from '../asset-list/asset-list.constants';
import { LEAF_KINDS } from './project-browser.constants';
import type { BrowserQuery, FileEntry, NumberTest } from './project-browser.type';

const compared = (value: number, test: NumberTest): boolean => {
  if (test.op === 'lt') return value < test.value;
  return test.op === 'gt' ? value > test.value : value === test.value;
};

const passes = (value: number | null, tests: readonly NumberTest[]): boolean => tests.every((test) => value !== null && compared(value, test));

const named = (names: readonly string[], wanted: string): boolean => names.some((name) => name.toLowerCase().includes(wanted));

const flagHolds = (entry: FileEntry, flag: BrowserQuery['is'][number]): boolean => {
  if (flag === 'unsaved') return entry.row.dirty;
  if (flag === 'open') return entry.facts.open;
  if (flag === 'pinned') return entry.pinned;
  return LEAF_KINDS.has(entry.row.kind) && entry.facts.usedBy.length === 0;
};

const wordsMatch = (entry: FileEntry, query: BrowserQuery): boolean =>
  query.words.every((word) => [entry.row.name, entry.row.folder, KIND_LABEL[entry.row.kind]].some((text) => text.toLowerCase().includes(word)));

const placeMatches = (entry: FileEntry, query: BrowserQuery): boolean => {
  const where = entry.row.path.toLowerCase();
  const inside = query.inFolder === null || where.includes(`/${query.inFolder}/`) || where.endsWith(`/${query.inFolder}`);
  return inside && (query.kinds.length === 0 || query.kinds.includes(entry.row.kind));
};

const linksMatch = (entry: FileEntry, query: BrowserQuery): boolean =>
  query.uses.every((wanted) => named(entry.facts.uses, wanted)) && query.usedBy.every((wanted) => named(entry.facts.usedBy, wanted));

const measuresMatch = (entry: FileEntry, query: BrowserQuery): boolean => {
  const { width, height, colours } = entry.facts;
  const longest = width === null || height === null ? null : Math.max(width, height);
  return passes(longest, query.size) && passes(colours, query.colours);
};

const matchEntry = (entry: FileEntry, query: BrowserQuery): boolean =>
  wordsMatch(entry, query) && placeMatches(entry, query) && linksMatch(entry, query) && query.is.every((flag) => flagHolds(entry, flag)) && measuresMatch(entry, query);

export { matchEntry };
