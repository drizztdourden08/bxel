/* @layer renderer-app @kind logic */
import { A11Y_BLOCKING, A11Y_KNOWN_GAPS } from './a11y.constants';
import type { A11yFinding } from './a11y.type';

const isKnown = (rule: string, target: string): boolean =>
  A11Y_KNOWN_GAPS.some((gap) => gap.rule === rule && target.includes(gap.target));

const blockingFindings = (findings: readonly A11yFinding[]): A11yFinding[] =>
  findings
    .filter((finding) => A11Y_BLOCKING.some((impact) => impact === finding.impact))
    .map((finding) => ({ ...finding, targets: finding.targets.filter((target) => !isKnown(finding.rule, target)) }))
    .filter((finding) => finding.targets.length > 0);

export { blockingFindings };
