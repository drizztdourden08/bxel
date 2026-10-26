/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { answerDialogs } from './support/answer-dialogs';
import { GRANT_FOLDERS } from './support/e2e.constants';
import { inFreshPlace } from './support/in-place';
import { openSession } from './support/open-session';
import { readSaved } from './support/read-saved';
import { runMenu } from './support/run-menu';
import { saveFile } from './support/save-file';
import { TILED_E2E } from './support/tiled.constants';
import { waitText } from './support/wait-text';
import { writeTiledFiles } from './support/write-tiled-files';

describe('Tiled import: a map with its tileset and image becomes a tileset and a tilemap', () => {
  test('reads a TMX with an external TSX and PNG from a folder it is granted on the spot through the colour step and saves both files', async () => {
    await inFreshPlace(async (place) => {
      const mapPath = await writeTiledFiles(place);
      const session = await openSession(GRANT_FOLDERS);
      try {
        await answerDialogs(session, { open: mapPath, save: null });
        await runMenu(session, [/^File/, /^Import$/, /^Tiled map/]);
        const dialog = session.page.getByRole('dialog', { name: /^Import Tiled map/ });
        await dialog.getByRole('button', { name: 'Next: Colours' }).click();
        await dialog.getByRole('application', { name: /^Original, 4 colours/ }).waitFor();
        await dialog.getByText(/^Extract the best/).click();
        await dialog.getByRole('button', { name: 'Import map' }).click();
        await dialog.waitFor({ state: 'detached' });
        await waitText(session, /Imported the Tiled map level with 4 tiles/);
        await saveFile(session, join(place, TILED_E2E.savedMap), [join(place, TILED_E2E.savedTiles)]);
        const saved = readSaved(join(place, TILED_E2E.savedMap));
        expect(saved.tilesets[0]?.tiles).toHaveLength(4);
        expect(saved.tilemaps[0]).toMatchObject({ name: 'level', columns: TILED_E2E.columns, rows: TILED_E2E.rows });
        expect(Array.from(saved.tilemaps[0]?.layers[0]?.cells ?? [])).toEqual(TILED_E2E.cells);
      } finally {
        await session.close();
      }
    });
  });
});
