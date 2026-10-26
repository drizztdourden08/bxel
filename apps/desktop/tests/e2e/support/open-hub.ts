/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';

const SETTINGS = 'Control+,';

const openHub = async (session: Session, hub: string): Promise<void> => {
  const switcher = session.page.getByRole('navigation', { name: 'Switch hub' });
  if (!(await switcher.isVisible())) {
    await session.page.keyboard.press(SETTINGS);
    await switcher.waitFor();
  }
  await switcher.getByRole('button', { name: hub, exact: true }).click();
};

export { openHub };
