/* @layer renderer-app @kind logic */
import { basename } from 'node:path';
import { answerDialogs } from './answer-dialogs';
import { POLL_MS, SHORTCUT } from './e2e.constants';
import type { Session } from './e2e.type';

const openFile = async (session: Session, path: string): Promise<void> => {
  await answerDialogs(session, { open: path, save: null });
  await session.page.keyboard.press(SHORTCUT.open);
  await session.page.getByText(`${basename(path)} - Bxel`).waitFor({ timeout: POLL_MS });
};

export { openFile };
