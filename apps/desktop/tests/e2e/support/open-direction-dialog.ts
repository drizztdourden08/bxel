/* @layer renderer-app @kind logic */
import type { Locator } from 'playwright-core';
import { openMore } from './animation-ui';
import type { Session } from './e2e.type';

const openDirectionDialog = async (session: Session): Promise<Locator> => {
  await openMore(session, 'Transform animation', 'New direction set...');
  const dialog = session.page.getByRole('dialog', { name: 'New direction set' });
  await dialog.getByText('Eight directions', { exact: true }).click();
  await dialog.getByRole('spinbutton', { name: 'Frames per facing' }).fill('2');
  return dialog;
};

export { openDirectionDialog };
