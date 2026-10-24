/* @layer core @kind logic */
import type { EntryCheck } from './entry-check.type';
import { entryPaths } from './entry-paths';
import type { LoadIssue } from './load-report.type';
import type { Manifest } from './manifest.type';

const fatalEntryIssues = (manifest: Manifest, check: EntryCheck): readonly LoadIssue[] =>
  [...check.problems]
    .filter(([path]) => !entryPaths.isCel(path) && !entryPaths.isTilemapLayer(path) && path !== manifest.preview)
    .map(([, issue]) => issue);

export { fatalEntryIssues };
