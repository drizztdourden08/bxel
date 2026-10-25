/* @layer renderer-app @kind logic */
import axe from 'axe-core';
import type { Page } from 'playwright-core';
import { A11Y_SAMPLE_LIMIT, A11Y_TAGS } from './a11y.constants';
import type { A11yFinding } from './a11y.type';

type AxeCheck = { readonly message: string };
type AxeNode = { readonly target: readonly unknown[]; readonly any: readonly AxeCheck[]; readonly all: readonly AxeCheck[]; readonly none: readonly AxeCheck[] };
type AxeResult = { readonly id: string; readonly impact: string | null; readonly help: string; readonly nodes: readonly AxeNode[] };
type AxeRun = { readonly violations: readonly AxeResult[] };

const runExpression = (root: string | null): string => {
  const scope = root === null ? 'document' : `document.querySelector(${JSON.stringify(root)})`;
  return `axe.run(${scope}, ${JSON.stringify({ runOnly: { type: 'tag', values: [...A11Y_TAGS] } })})`;
};

const describeNode = (node: AxeNode): string =>
  `${node.target.map(String).join(' ')} :: ${[...node.any, ...node.all, ...node.none].map((check) => check.message).join(' | ')}`;

const auditPage = async (page: Page, root: string | null = null): Promise<A11yFinding[]> => {
  await page.evaluate(axe.source);
  const run = await page.evaluate<AxeRun>(runExpression(root));
  return run.violations.map((result) => ({
    rule: result.id,
    impact: result.impact ?? 'minor',
    help: result.help,
    targets: result.nodes.slice(0, A11Y_SAMPLE_LIMIT).map(describeNode),
  }));
};

export { auditPage };
