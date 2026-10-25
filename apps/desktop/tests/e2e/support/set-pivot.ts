/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';

const set = async (session: Session, label: string, value: number): Promise<void> => {
  const field = session.page.getByRole('spinbutton', { name: label, exact: true });
  await field.fill(String(value));
  await field.press('Tab');
  await session.page.waitForTimeout(800);
};

const setPivot = async (session: Session, sprite: string, x: number, y: number): Promise<void> => {
  const { page } = session;
  await page.getByRole('tablist', { name: 'Open assets' }).getByRole('tab', { name: new RegExp(`^${sprite}`) }).click();
  await page.keyboard.press('Alt+Enter');
  await page.getByRole('spinbutton', { name: 'Pivot x', exact: true }).waitFor();
  await set(session, 'Pivot x', x);
  await set(session, 'Pivot y', y);
  await page.keyboard.press('Escape');
};

export { setPivot };
