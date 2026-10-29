/* @layer renderer-app @kind logic */
import { POLL_MS } from './e2e.constants';
import type { Session } from './e2e.type';
import { assetRow, rowActions } from './panel-assets';

const listed = (session: Session, name: string) => assetRow(session, name);

const chooseEntryAction = async (session: Session, name: string, action: string): Promise<void> => {
  await listed(session, name).hover();
  await rowActions(session, name).click();
  await session.page.getByRole('menuitem', { name: action, exact: true }).click();
};

const renameProjectEntryInUi = async (session: Session, from: string, to: string): Promise<void> => {
  await chooseEntryAction(session, from, 'Rename');
  const field = session.page.getByRole('textbox', { name: 'New name' });
  await field.fill(to);
  await field.press('Enter');
  await listed(session, to).waitFor({ timeout: POLL_MS });
};

const trashProjectEntryInUi = async (session: Session, name: string): Promise<void> => {
  await chooseEntryAction(session, name, 'Move to trash');
  await session.page.getByRole('button', { name: 'Move to trash', exact: true }).click({ timeout: 1500 }).catch(() => undefined);
  await listed(session, name).waitFor({ state: 'detached', timeout: POLL_MS });
};

const createProjectFolderInUi = async (session: Session, name: string): Promise<void> => {
  await session.page.getByRole('button', { name: 'Choose what to make' }).click();
  await session.page.getByRole('menuitem', { name: 'New folder' }).click();
  const field = session.page.getByRole('textbox', { name: 'New name' });
  await field.fill(name);
  await field.press('Enter');
  await listed(session, name).waitFor({ timeout: POLL_MS });
};

export { createProjectFolderInUi, listed, renameProjectEntryInUi, trashProjectEntryInUi };
