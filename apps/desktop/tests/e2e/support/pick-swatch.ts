/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';

const pickSwatch = async (session: Session, index: number): Promise<void> => {
  await session.page.getByRole('region', { name: 'Palette' }).getByRole('button', { name: new RegExp(`^Swatch ${index},`) }).click();
};

export { pickSwatch };
