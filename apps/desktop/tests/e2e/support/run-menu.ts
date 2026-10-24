/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';

const runMenu = async (session: Session, path: readonly RegExp[]): Promise<void> => {
  await session.page.getByRole('button', { name: 'Menu', exact: true }).click();
  for (const name of path) await session.page.getByRole('menuitem', { name }).first().click();
};

export { runMenu };
