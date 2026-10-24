/* @layer renderer-app @kind logic */
import { answerDialogs } from './answer-dialogs';
import { POLL_MS } from './e2e.constants';
import type { Session } from './e2e.type';
import { runMenu } from './run-menu';

const linkFolderInUi = async (session: Session, project: string, folder: string): Promise<void> => {
  await runMenu(session, [/^Project/, /^Project settings/]);
  const dialog = session.page.getByRole('dialog', { name: `Project settings: ${project}` });
  await dialog.waitFor();
  await answerDialogs(session, { open: folder, save: null });
  await dialog.getByRole('button', { name: 'Add a linked folder...' }).click();
  await dialog.getByRole('button', { name: /^Remove the linked folder/ }).waitFor({ timeout: POLL_MS });
};

const unlinkFolderInUi = async (session: Session, project: string): Promise<void> => {
  const dialog = session.page.getByRole('dialog', { name: `Project settings: ${project}` });
  const remove = dialog.getByRole('button', { name: /^Remove the linked folder/ });
  await remove.click();
  await remove.waitFor({ state: 'detached', timeout: POLL_MS });
  await dialog.getByRole('button', { name: 'Done' }).click();
  await dialog.waitFor({ state: 'detached' });
};

export { linkFolderInUi, unlinkFolderInUi };
