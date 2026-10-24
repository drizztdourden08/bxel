/* @layer core @kind logic */
import type { RuleFinding } from './finding.type';

const findNewBreaks = (before: readonly RuleFinding[], after: readonly RuleFinding[]): readonly RuleFinding[] => {
  const known = new Map(before.map((finding) => [finding.key, finding.excess]));
  return after.filter((finding) => finding.tier === 'enforce' && finding.excess > (known.get(finding.key) ?? 0));
};

export { findNewBreaks };
