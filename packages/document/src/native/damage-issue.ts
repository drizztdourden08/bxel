/* @layer core @kind logic */
import { entryPaths } from './entry-paths';
import type { DamagedCel, LoadIssue } from './load-report.type';
import { makeIssue } from './make-issue';

const damageIssue = (damage: DamagedCel): LoadIssue =>
  makeIssue(damage.code, damage.message, entryPaths.cel(damage.celId));

export { damageIssue };
