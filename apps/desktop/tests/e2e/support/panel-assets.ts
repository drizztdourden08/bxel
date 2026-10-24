/* @layer renderer-app @kind logic */
import type { Locator } from 'playwright-core';
import type { Session } from './e2e.type';

const chip = (session: Session, pattern: RegExp): Locator =>
  session.page.getByRole('radiogroup', { name: 'Kinds' }).getByRole('radio', { name: pattern });

const assetList = (session: Session): Locator => session.page.getByRole('list', { name: 'Project assets' });

const assetRow = (session: Session, name: string): Locator => assetList(session).getByRole('listitem').filter({ hasText: name }).first();

const assetNames = async (session: Session): Promise<string[]> => {
  const rows = await assetList(session).getByRole('listitem').all();
  return Promise.all(rows.map(async (row) => ((await row.innerText()).split('\n')[0] ?? '').trim()));
};

export { assetList, assetNames, assetRow, chip };
