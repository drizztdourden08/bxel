/* @layer renderer-app @kind logic */
import type { Locator } from 'playwright-core';
import type { Session } from './e2e.type';

const projectTree = (session: Session): Locator => session.page.getByRole('tree', { name: /^Project (files|assets)$/ });

const assetRow = (session: Session, name: string): Locator => projectTree(session).getByRole('treeitem').filter({ hasText: name }).first();

const rowActions = (session: Session, name: string): Locator => session.page.getByRole('button', { name: `Actions for ${name}` });

const filterChip = (session: Session, label: string): Locator => session.page.getByRole('group', { name: 'Active filters' }).getByText(label, { exact: true });

const treeNames = async (session: Session): Promise<string[]> => {
  const rows = await projectTree(session).getByRole('treeitem').all();
  return Promise.all(rows.map(async (row) => ((await row.innerText()).split('\n')[0] ?? '').trim()));
};

export { assetRow, filterChip, projectTree, rowActions, treeNames };
