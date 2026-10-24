/* @layer renderer-app @kind logic */
import { SHORTCUT } from './e2e.constants';
import type { Session } from './e2e.type';

const createSprite = async (session: Session): Promise<void> => {
  await session.page.keyboard.press(SHORTCUT.newFile);
  const dialog = session.page.getByRole('dialog', { name: 'New asset' });
  await dialog.getByRole('button', { name: 'Create sprite' }).click();
  await dialog.waitFor({ state: 'detached' });
};

export { createSprite };
