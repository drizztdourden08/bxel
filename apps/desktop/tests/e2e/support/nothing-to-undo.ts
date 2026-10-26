/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';

const nothingToUndo = async (session: Session): Promise<number> => {
  const { page } = session;
  await page.getByRole('button', { name: /^Quick actions/ }).click();
  const menu = page.getByRole('menu');
  await menu.waitFor();
  const count = await menu.getByRole('menuitem', { name: /^Nothing to undo/ }).count();
  await page.keyboard.press('Escape');
  await menu.waitFor({ state: 'detached' });
  return count;
};

export { nothingToUndo };
