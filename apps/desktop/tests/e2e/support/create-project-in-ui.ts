/* @layer renderer-app @kind logic */
import { answerDialogs } from './answer-dialogs';
import type { Session } from './e2e.type';
import { runMenu } from './run-menu';

const createProjectInUi = async (session: Session, folder: string, name: string): Promise<void> => {
  await runMenu(session, [/^Project/, /^New project/]);
  const dialog = session.page.getByRole('dialog', { name: 'New project' });
  await dialog.waitFor();
  await answerDialogs(session, { open: folder, save: null });
  await dialog.getByRole('button', { name: 'Choose folder' }).click();
  await dialog.getByText(folder, { exact: true }).waitFor();
  await dialog.getByRole('textbox', { name: 'Project name' }).fill(name);
  await dialog.getByRole('button', { name: 'Create project' }).click();
  await dialog.waitFor({ state: 'detached' });
};

export { createProjectInUi };
