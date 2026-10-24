/* @layer renderer-app @kind logic */
import { access } from 'node:fs/promises';
import { expect } from 'vitest';
import { answerDialogs } from './answer-dialogs';
import { POLL_MS, SHORTCUT } from './e2e.constants';
import type { Session } from './e2e.type';
import { waitSaved } from './wait-saved';

const exists = (path: string): Promise<boolean> => access(path).then(() => true, () => false);

const saveFile = async (session: Session, path: string, more: readonly string[] = []): Promise<void> => {
  await answerDialogs(session, { open: null, save: [path, ...more] });
  await session.page.keyboard.press(SHORTCUT.saveAs);
  await expect.poll(() => exists(path), { timeout: POLL_MS }).toBe(true);
  await waitSaved(session);
};

export { saveFile };
