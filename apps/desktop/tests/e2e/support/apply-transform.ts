/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';

const applyTransform = async (session: Session, action: string): Promise<void> => {
  await session.page.getByRole('region', { name: 'Transform' }).getByRole('button', { name: action, exact: true }).click();
  const bar = session.page.getByRole('region', { name: 'Apply bar' });
  await bar.getByRole('button', { name: 'Apply', exact: true }).click();
  await bar.waitFor({ state: 'detached' });
};

export { applyTransform };
