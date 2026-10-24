/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';
import { pickTransform } from './pick-transform';

const applyTransform = async (session: Session, action: string): Promise<void> => {
  await pickTransform(session, action);
  const bar = session.page.getByRole('alertdialog', { name: 'Apply bar' });
  await bar.getByRole('button', { name: 'Apply', exact: true }).click();
  await bar.waitFor({ state: 'detached' });
};

export { applyTransform };
