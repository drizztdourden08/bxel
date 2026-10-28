/* @layer renderer-app @kind logic */
import { KIND_LABEL } from '../asset-list/asset-list.constants';
import type { BrowserQuery, FileEntry, NumberTest } from './project-browser.type';

const LEAF_KINDS: ReadonlySet<string> = new Set(['sprite', 'animation', 'palette', 'tileset']);

const passes = (value: number | null, tests: readonly NumberTest[]): boolean =>
  tests.every((test) => value !== null && (test.op === 'lt' ? value < test.value : test.op === 'gt' ? value > test.value : value === test.value));

const named = (names: readonly string[], wanted: string): boolean => names.some((name) => name.toLowerCase().includes(wanted));

const flagHolds = (entry: FileEntry, flag: BrowserQuery['is'][number]): boolean => {
  if (flag === 'unsaved') return entry.row.dirty;
  if (flag === 'open') return entry.facts.open;
  if (flag === 'pinned') return entry.pinned;
  return LEAF_KINDS.has(entry.row.kind) && entry.facts.usedBy.length === 0;
};

const matchEntry = (entry: FileEntry, query: BrowserQuery): boolean => {
  const { row, facts } = entry;
  const longest = facts.width === null || facts.height === null ? null : Math.max(facts.width, facts.height);
  const where = row.path.toLowerCase();
  return (
    query.words.every((word) => [row.name, row.folder, KIND_LABEL[row.kind]].some((text) => text.toLowerCase().includes(word))) &&
    (query.kinds.length === 0 || query.kinds.includes(row.kind)) &&
    (query.inFolder === null || where.includes(`/${query.inFolder}/`) || where.endsWith(`/${query.inFolder}`)) &&
    query.uses.every((wanted) => named(facts.uses, wanted)) &&
    query.usedBy.every((wanted) => named(facts.usedBy, wanted)) &&
    query.is.every((flag) => flagHolds(entry, flag)) &&
    passes(longest, query.size) &&
    passes(facts.colours, query.colours)
  );
};

export { matchEntry };
