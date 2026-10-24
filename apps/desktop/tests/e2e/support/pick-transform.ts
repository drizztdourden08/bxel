/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';

const escaped = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const pickTransform = async (session: Session, action: string): Promise<void> => {
  await session.page.getByRole('toolbar', { name: 'Canvas' }).getByRole('button', { name: 'Transform' }).hover();
  await session.page.getByRole('menuitem', { name: new RegExp(`^${escaped(action)}`) }).first().click();
};

export { pickTransform };
