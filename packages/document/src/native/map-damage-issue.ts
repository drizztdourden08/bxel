/* @layer core @kind logic */
import { entryPaths } from './entry-paths';
import type { DamagedMapLayer, LoadIssue } from './load-report.type';
import { makeIssue } from './make-issue';

const mapDamageIssue = (damage: DamagedMapLayer): LoadIssue =>
  makeIssue(damage.code, damage.message, entryPaths.tilemapLayer(damage.layerId));

export { mapDamageIssue };
