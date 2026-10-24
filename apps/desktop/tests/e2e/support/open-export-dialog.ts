/* @layer renderer-app @kind logic */
import type { Locator } from 'playwright-core';
import { answerDialogs } from './answer-dialogs';
import { SHORTCUT } from './e2e.constants';
import type { DialogAnswers, Session } from './e2e.type';

const openExportDialog = async (session: Session, answers: DialogAnswers): Promise<Locator> => {
  await answerDialogs(session, answers);
  await session.page.keyboard.press(SHORTCUT.exportImages);
  return session.page.getByRole('dialog', { name: 'Export' });
};

export { openExportDialog };
