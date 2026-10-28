/* @layer renderer-app @kind logic */
import { answerDialogs } from './answer-dialogs';
import type { Session } from './e2e.type';
import { runMenu } from './run-menu';
import { waitText } from './wait-text';

const openDemo = async (session: Session, parent: string): Promise<void> => {
  await answerDialogs(session, { open: parent, save: null });
  await runMenu(session, [/^Help$/, /^Open the demo project$/]);
  await waitText(session, /Opened the project Bxel Demo/);
};

export { openDemo };
