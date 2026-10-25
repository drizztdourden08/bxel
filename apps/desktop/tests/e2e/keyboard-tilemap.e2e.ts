/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { expectAnnounced } from './support/expect-announced';
import { openTilemapRig } from './support/open-tilemap-rig';
import { readSaved } from './support/read-saved';
import { saveFile } from './support/save-file';
import { TILEMAP_E2E } from './support/tilemap.constants';
import { useRig } from './support/use-rig';

const { columns } = TILEMAP_E2E;

describe('accessibility: placing a tile on the map with the keyboard alone', () => {
  const rig = useRig(openTilemapRig);

  test('the arrow keys move a cell cursor and Enter places the current tile', async () => {
    const { session } = rig();
    const { page } = session;
    await page.getByRole('application', { name: TILEMAP_E2E.label }).focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
    await expectAnnounced(session, /^Cell 17, 13/);
    await page.keyboard.press('Enter');
    await expectAnnounced(session, 'Placed at cell 17, 13');
    const path = join(session.dir, TILEMAP_E2E.file);
    await saveFile(session, path, [join(session.dir, 'tiles.bxtiles')]);
    const placed = Array.from(readSaved(path).tilemaps[0]?.layers[0]?.cells ?? []).flatMap((cell, at) => (cell === 0 ? [] : [at]));
    expect(placed).toEqual([13 * columns + 17]);
  });
});
