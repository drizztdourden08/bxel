/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';
import { openAssetRow } from './open-asset-row';

const openSheetTab = async (session: Session, name: string): Promise<void> => {
  await openAssetRow(session, name);
  await session.page.getByRole('region', { name: 'Sheet' }).waitFor();
};

export { openSheetTab };
