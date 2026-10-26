/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';

const showSheetList = async (session: Session): Promise<void> => {
  const { page } = session;
  const list = page.getByRole('radiogroup', { name: 'View', exact: true }).getByRole('radio', { name: 'List view' });
  if (!(await list.isVisible())) await page.getByText('Search, view and filters', { exact: true }).click();
  await list.click();
  await page.getByRole('region', { name: 'Sprites', exact: true }).getByRole('grid').waitFor();
};

export { showSheetList };
