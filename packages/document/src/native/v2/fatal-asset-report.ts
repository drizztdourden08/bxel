/* @layer core @kind logic */
import type { LoadIssue } from '../load-report.type';
import type { AssetReport } from './asset-report.type';

const fatalAssetReport = (issues: readonly LoadIssue[]): AssetReport => ({
  outcome: 'fatal',
  slice: null,
  readOnly: true,
  notice: null,
  manifest: null,
  preview: null,
  issues,
  damage: [],
  mapDamage: [],
  missingLinks: [],
});

export { fatalAssetReport };
