/* @layer renderer-app @kind logic */
import { POLL_MS } from './e2e.constants';
import type { Session } from './e2e.type';

const addProjectFileInUi = async (session: Session, name: string): Promise<void> => {
  const { page } = session;
  await page.getByRole('button', { name: 'New file in the project' }).click();
  await page.getByRole('textbox', { name: 'File name' }).fill(name);
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await page.getByRole('list', { name: 'Project files' }).getByText(`${name}.bxel`).waitFor({ timeout: POLL_MS });
};

export { addProjectFileInUi };
