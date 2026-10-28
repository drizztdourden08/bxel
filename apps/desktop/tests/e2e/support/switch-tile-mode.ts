/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';
import { TILEMAP_E2E } from './tilemap.constants';

const switchTileMode = async (session: Session, mode: 'Place Tile' | 'Edit Tile'): Promise<void> => {
  const button = session.page.getByRole('toolbar', { name: 'Tools' }).getByRole('button', { name: /^Tile mode: / });
  if (!(await button.getAttribute('aria-label'))?.includes(mode)) await button.click();
  const label = mode === 'Place Tile' ? TILEMAP_E2E.label : 'Sprite canvas';
  await session.page.getByRole('application', { name: label }).waitFor();
};

export { switchTileMode };
