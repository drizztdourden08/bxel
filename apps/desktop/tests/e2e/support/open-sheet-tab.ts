/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';
import { openAssetTab } from './open-asset-tab';
import { assetRow } from './panel-assets';
import { showPanelView } from './show-folder-view';

const openSheetTab = async (session: Session, name: string): Promise<void> => {
  await showPanelView(session, 'Assets');
  await session.page.getByRole('searchbox', { name: 'Search the project' }).fill(name);
  await assetRow(session, name).click();
  await openAssetTab(session, new RegExp(name)).waitFor();
  await session.page.getByRole('region', { name: 'Sheet' }).waitFor();
};

export { openSheetTab };
