/* @layer renderer-app @kind logic */
import { POLL_MS } from './e2e.constants';
import type { Session } from './e2e.type';
import { showPanelView } from './show-folder-view';

const addProjectFileInUi = async (session: Session, name: string): Promise<void> => {
  const { page } = session;
  await showPanelView(session, 'Folders');
  await page.getByRole('button', { name: 'New asset' }).and(page.locator(':not(.start-stage *)')).click();
  await page.getByRole('menuitem', { name: 'Sprite', exact: true }).click();
  await page.getByRole('textbox', { name: 'File name' }).fill(name);
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await page.getByRole('list', { name: 'Project files' }).getByText(`${name}.bxsprite`).waitFor({ timeout: POLL_MS });
};

export { addProjectFileInUi };
