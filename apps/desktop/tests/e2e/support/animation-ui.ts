/* @layer renderer-app @kind logic */
import type { Locator } from 'playwright-core';
import { openAssetRow } from './open-asset-row';
import type { Session } from './e2e.type';

const timelineOf = (session: Session): Locator => session.page.getByRole('region', { name: 'Timeline' });

const frameButton = (session: Session, number: number): Locator => timelineOf(session).getByRole('button', { name: new RegExp(`^Frame ${number},`) });

const openAnimationTab = async (session: Session, name: string): Promise<void> => {
  await openAssetRow(session, name);
  await timelineOf(session).getByRole('list', { name: 'Frames' }).waitFor();
};

const fillNumber = async (field: Locator, value: number): Promise<void> => {
  await field.fill(String(value));
  await field.press('Tab');
};

export { fillNumber, frameButton, openAnimationTab, timelineOf };
