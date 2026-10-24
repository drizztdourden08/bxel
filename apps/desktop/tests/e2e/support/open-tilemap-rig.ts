/* @layer renderer-app @kind logic */
import { canvasMapper } from './canvas-mapper';
import type { CellMapper, Session } from './e2e.type';
import { openSession } from './open-session';
import { TILEMAP_E2E } from './tilemap.constants';

type TilemapRig = {
  readonly session: Session;
  readonly mapper: () => Promise<CellMapper>;
};

const openTilemapRig = async (): Promise<TilemapRig> => {
  const session = await openSession();
  const { page } = session;
  await page.getByRole('radio', { name: 'Tilemap', exact: true }).click();
  await page.getByRole('button', { name: 'New tileset', exact: true }).click();
  const tileset = page.getByRole('dialog', { name: 'New tileset' });
  await tileset.getByRole('button', { name: 'Create' }).click();
  await tileset.waitFor({ state: 'detached' });
  await page.getByRole('button', { name: 'New tilemap', exact: true }).click();
  const tilemap = page.getByRole('dialog', { name: 'New tilemap' });
  await tilemap.getByRole('button', { name: 'Create' }).click();
  await tilemap.waitFor({ state: 'detached' });
  await page.getByRole('application', { name: TILEMAP_E2E.label }).waitFor();
  const add = page.getByRole('region', { name: 'Tileset' }).getByRole('button', { name: 'Add tile' });
  await add.click();
  await add.click();
  const size = { width: TILEMAP_E2E.columns * TILEMAP_E2E.tile, height: TILEMAP_E2E.rows * TILEMAP_E2E.tile };
  return { session, mapper: () => canvasMapper(session, size, TILEMAP_E2E.label) };
};

export { openTilemapRig };
