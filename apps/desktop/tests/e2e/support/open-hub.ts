/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';

const WINDOW_KEYS: Readonly<Record<string, string>> = {
  Project: 'Control+Shift+P',
  Properties: 'Alt+Enter',
  Options: 'Control+,',
};

const openHub = async (session: Session, hub: string): Promise<void> => {
  const key = WINDOW_KEYS[hub];
  if (key === undefined) throw new Error(`There is no window named ${hub}.`);
  await session.page.keyboard.press(key);
};

export { openHub };
