/* @layer renderer-app @kind logic */
import { answerDialogs } from './answer-dialogs';
import type { Session } from './e2e.type';
import { runMenu } from './run-menu';
import { waitText } from './wait-text';

const openProjectAtInUi = async (session: Session, folder: string, name: string): Promise<void> => {
  await answerDialogs(session, { open: folder, save: null });
  await runMenu(session, [/^Project/, /^Open project/]);
  await waitText(session, new RegExp(`Opened the project ${name}`));
};

export { openProjectAtInUi };
