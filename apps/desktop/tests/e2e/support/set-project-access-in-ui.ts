/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';
import type { AccessChoice } from './project-rig.type';
import { runMenu } from './run-menu';

const setProjectAccessInUi = async (session: Session, project: string, choice: AccessChoice): Promise<void> => {
  const { page } = session;
  await runMenu(session, [/^Settings/]);
  await page.getByRole('navigation').getByText('Assistant projects', { exact: true }).click();
  await page.getByRole('combobox', { name: `Let the assistant browse ${project}` }).click();
  await page.getByRole('option', { name: choice, exact: true }).click();
  await page.getByRole('combobox', { name: `Let the assistant browse ${project}` }).filter({ hasText: choice }).waitFor();
  await page.keyboard.press('Escape');
};

export { setProjectAccessInUi };
