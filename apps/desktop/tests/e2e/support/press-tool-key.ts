/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';

const pressToolKey = async (session: Session, keys: string): Promise<void> => {
  await session.page.getByRole('application', { name: 'Sprite canvas' }).focus();
  await session.page.keyboard.press(keys);
};

export { pressToolKey };
