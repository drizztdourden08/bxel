/* @layer renderer-app @kind logic */
import { POLL_MS } from './e2e.constants';
import type { Session } from './e2e.type';
import { assetRow } from './panel-assets';

const addProjectFileInUi = async (session: Session, name: string): Promise<void> => {
  const { page } = session;
  await page.getByRole('button', { name: 'New', exact: true }).and(page.locator(':not(.start-stage *)')).click();
  const field = page.getByRole('textbox', { name: 'Sprite name' });
  await field.fill(name);
  await field.press('Enter');
  await assetRow(session, name).waitFor({ timeout: POLL_MS });
  await assetRow(session, name).getByRole('img', { name: 'Unsaved changes' }).waitFor({ state: 'detached', timeout: POLL_MS });
};

export { addProjectFileInUi };
