/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';

const showPanelView = async (session: Session, view: 'Tree' | 'List'): Promise<void> => {
  const { page } = session;
  await page.getByRole('button', { name: 'View options' }).click();
  await page.getByRole('menuitemradio', { name: view, exact: true }).click();
};

export { showPanelView };
