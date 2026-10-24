/* @layer renderer-app @kind logic */
import { POLL_MS } from './e2e.constants';
import type { Session } from './e2e.type';
import { showPanelView } from './show-folder-view';

const listed = (session: Session, name: string) =>
  session.page.getByRole('list', { name: 'Project files' }).getByText(name, { exact: true });

const chooseEntryAction = async (session: Session, name: string, action: string): Promise<void> => {
  await showPanelView(session, 'Folders');
  await session.page.getByRole('button', { name: `Actions for ${name}` }).click();
  await session.page.getByRole('menuitem', { name: action, exact: true }).click();
};

const renameProjectEntryInUi = async (session: Session, from: string, to: string): Promise<void> => {
  await chooseEntryAction(session, from, 'Rename');
  await session.page.getByRole('textbox', { name: 'New name' }).fill(to);
  await session.page.getByRole('button', { name: 'Save name', exact: true }).click();
  await listed(session, to).waitFor({ timeout: POLL_MS });
};

const trashProjectEntryInUi = async (session: Session, name: string): Promise<void> => {
  await chooseEntryAction(session, name, 'Move to trash');
  await session.page.getByRole('button', { name: 'Move to trash', exact: true }).click();
  await listed(session, name).waitFor({ state: 'detached', timeout: POLL_MS });
};

const createProjectFolderInUi = async (session: Session, name: string): Promise<void> => {
  await showPanelView(session, 'Folders');
  await session.page.getByRole('button', { name: 'New folder in the project' }).click();
  await session.page.getByRole('textbox', { name: 'Folder name' }).fill(name);
  await session.page.getByRole('button', { name: 'Create', exact: true }).click();
  await listed(session, name).waitFor({ timeout: POLL_MS });
};

export { createProjectFolderInUi, listed, renameProjectEntryInUi, trashProjectEntryInUi };
