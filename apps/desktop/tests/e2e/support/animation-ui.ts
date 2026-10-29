/* @layer renderer-app @kind logic */
import type { Locator } from 'playwright-core';
import { openAssetRow } from './open-asset-row';
import type { Session } from './e2e.type';

const timelineOf = (session: Session): Locator => session.page.getByRole('region', { name: 'Timeline' });

const frameButton = (session: Session, number: number): Locator => timelineOf(session).getByRole('option', { name: new RegExp(`^Frame ${number} of`) });

const framesOf = (session: Session): Locator => timelineOf(session).getByRole('listbox', { name: 'Frames' });

const openMore = async (session: Session, ...path: string[]): Promise<void> => {
  await timelineOf(session).getByRole('button', { name: 'More timeline actions' }).click();
  for (const name of path) await session.page.getByRole('menuitem', { name, exact: true }).click();
};

const openFacing = async (session: Session): Promise<Locator> => {
  await timelineOf(session).getByRole('button', { name: /^Facing/ }).click();
  return session.page.getByRole('group', { name: 'Facings' });
};

const openAnimationTab = async (session: Session, name: string): Promise<void> => {
  await openAssetRow(session, name);
  await framesOf(session).waitFor();
};

const fillNumber = async (field: Locator, value: number): Promise<void> => {
  await field.fill(String(value));
  await field.press('Tab');
};

export { fillNumber, frameButton, framesOf, openAnimationTab, openFacing, openMore, timelineOf };
