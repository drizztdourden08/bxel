/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';

const escaped = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const openTransform = async (session: Session): Promise<void> => {
  const toolbar = session.page.getByRole('toolbar', { name: 'Canvas' });
  const direct = toolbar.getByRole('button', { name: 'Transform' });
  if (await direct.isVisible()) {
    await direct.click();
    return;
  }
  await toolbar.getByRole('button', { name: 'More tools' }).last().click();
  await session.page.getByRole('menuitem', { name: 'Transform' }).click();
};

const pickTransform = async (session: Session, action: string): Promise<void> => {
  await openTransform(session);
  await session.page.getByRole('menuitem', { name: new RegExp(`^${escaped(action)}`) }).first().click();
};

export { pickTransform };
