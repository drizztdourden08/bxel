/* @layer renderer-app @kind logic */
import { SHORTCUT } from './e2e.constants';
import type { Session } from './e2e.type';

type AssetKindName = 'Sprite' | 'Animation' | 'Sheet of sprites' | 'Palette' | 'Tileset' | 'Tilemap';

type MapSize = { readonly columns: number; readonly rows: number };

const createAsset = async (session: Session, kind: AssetKindName, size?: MapSize): Promise<void> => {
  await session.page.keyboard.press(SHORTCUT.newFile);
  const dialog = session.page.getByRole('dialog', { name: 'New asset' });
  await dialog.getByRole('radio', { name: kind, exact: true }).click();
  if (size) {
    await dialog.getByRole('spinbutton', { name: 'Columns' }).fill(String(size.columns));
    await dialog.getByRole('spinbutton', { name: 'Rows' }).fill(String(size.rows));
  }
  await dialog.getByRole('button', { name: /^Create/ }).click();
  await dialog.waitFor({ state: 'detached' });
};

export { createAsset };
