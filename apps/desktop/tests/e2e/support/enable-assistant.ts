/* @layer renderer-app @kind logic */
import { answerDialogs } from './answer-dialogs';
import type { Session } from './e2e.type';
import { runMenu } from './run-menu';

const enableAssistant = async (session: Session, folder: string): Promise<void> => {
  const { page } = session;
  await runMenu(session, [/^Settings/]);
  await page.getByRole('navigation').getByText('Assistant', { exact: true }).click();
  await page.getByRole('switch', { name: 'Assistant access' }).dispatchEvent('click');
  await page.locator('[role="switch"][aria-label="Assistant access"][aria-checked="true"]').waitFor({ state: 'attached' });
  await answerDialogs(session, { open: folder, save: null });
  await page.getByRole('button', { name: 'Browse' }).click();
  await page.getByTitle(folder).waitFor();
  await page.keyboard.press('Escape');
};

export { enableAssistant };
