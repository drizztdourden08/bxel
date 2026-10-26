/* @layer renderer-app @kind logic */
import type { Locator } from 'playwright-core';
import { openAssetTab } from './open-asset-tab';
import { assetRow } from './panel-assets';
import { showPanelView } from './show-folder-view';
import type { Session } from './e2e.type';

const timelineOf = (session: Session): Locator => session.page.getByRole('region', { name: 'Timeline' });

const frameButton = (session: Session, number: number): Locator => timelineOf(session).getByRole('button', { name: new RegExp(`^Frame ${number},`) });

const openAnimationTab = async (session: Session, name: string): Promise<void> => {
  await showPanelView(session, 'Assets');
  await session.page.getByRole('searchbox', { name: 'Search the project' }).fill(name);
  await assetRow(session, name).click();
  await openAssetTab(session, new RegExp(name)).waitFor();
  await timelineOf(session).getByRole('list', { name: 'Frames' }).waitFor();
};

const fillNumber = async (field: Locator, value: number): Promise<void> => {
  await field.fill(String(value));
  await field.press('Tab');
};

export { fillNumber, frameButton, openAnimationTab, timelineOf };
