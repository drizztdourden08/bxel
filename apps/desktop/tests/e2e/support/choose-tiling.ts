/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';
import { runMenu } from './run-menu';

const chooseTiling = async (session: Session, mode: RegExp): Promise<void> => {
  const { page } = session;
  await runMenu(session, [/^View$/, /^Tiled preview$/]);
  await page.getByRole('menuitemcheckbox', { name: mode }).first().click();
  if ((await page.locator('[role="menu"]').count()) > 0) await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.locator('[role="menu"]').first().waitFor({ state: 'detached' });
};

export { chooseTiling };
