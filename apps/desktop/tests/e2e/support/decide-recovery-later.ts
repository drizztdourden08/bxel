/* @layer renderer-app @kind logic */
import { CANVAS_LABEL } from './e2e.constants';
import type { Session } from './e2e.type';

const RECOVERY_WAIT_MS = 10_000;

const decideRecoveryLater = async (session: Session): Promise<void> => {
  const { page } = session;
  await page.getByRole('application', { name: CANVAS_LABEL }).waitFor();
  const dialog = page.getByRole('dialog', { name: 'Recover unsaved work' });
  const shown = await dialog.waitFor({ timeout: RECOVERY_WAIT_MS }).then(() => true, () => false);
  if (shown) await dialog.getByRole('button', { name: 'Decide later' }).click();
};

export { decideRecoveryLater };
