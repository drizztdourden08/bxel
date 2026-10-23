/* @layer core @kind logic */
import type { LoadIssue, LoadReport } from './load-report.type';

const fatalReport = (issues: readonly LoadIssue[]): LoadReport => ({
  outcome: 'fatal',
  project: null,
  readOnly: true,
  notice: null,
  migrated: false,
  manifest: null,
  preview: null,
  issues,
  damage: [],
});

export { fatalReport };
