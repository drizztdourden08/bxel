/* @layer renderer-app @kind logic */
import { canvasMapper } from './canvas-mapper';
import { createAsset } from './create-asset';
import type { CellMapper, Session } from './e2e.type';
import { openSession } from './open-session';
import { TILEMAP_E2E } from './tilemap.constants';

type TilemapRig = {
  readonly session: Session;
  readonly mapper: () => Promise<CellMapper>;
};

const openTilemapRig = async (args: readonly string[] = []): Promise<TilemapRig> => {
  const session = await openSession(args);
  const { page } = session;
  await createAsset(session, 'Tileset');
  await createAsset(session, 'Tilemap', { columns: TILEMAP_E2E.columns, rows: TILEMAP_E2E.rows });
  await page.getByRole('application', { name: TILEMAP_E2E.label }).waitFor();
  const add = page.getByRole('region', { name: 'Tileset' }).getByRole('button', { name: 'Add tile' });
  await add.click();
  await add.click();
  const size = { width: TILEMAP_E2E.columns * TILEMAP_E2E.tile, height: TILEMAP_E2E.rows * TILEMAP_E2E.tile };
  return { session, mapper: () => canvasMapper(session, size, TILEMAP_E2E.label) };
};

export { openTilemapRig };
