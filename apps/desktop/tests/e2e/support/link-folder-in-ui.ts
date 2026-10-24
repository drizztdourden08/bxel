/* @layer renderer-app @kind logic */
import { answerDialogs } from './answer-dialogs';
import { POLL_MS } from './e2e.constants';
import type { Session } from './e2e.type';
import { runMenu } from './run-menu';

const REMOVE = /^Remove the linked folder/;

const linkFolderInUi = async (session: Session, folder: string): Promise<void> => {
  await runMenu(session, [/^Project/, /^Project settings/]);
  await session.page.getByText('Folders', { exact: true }).first().click();
  await answerDialogs(session, { open: folder, save: null });
  await session.page.getByRole('button', { name: 'Add a linked folder...' }).click();
  await session.page.getByRole('button', { name: REMOVE }).waitFor({ timeout: POLL_MS });
};

const unlinkFolderInUi = async (session: Session): Promise<void> => {
  const remove = session.page.getByRole('button', { name: REMOVE });
  await remove.click();
  await remove.waitFor({ state: 'detached', timeout: POLL_MS });
  await session.page.keyboard.press('Escape');
};

export { linkFolderInUi, unlinkFolderInUi };
