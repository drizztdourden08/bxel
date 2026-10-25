/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { describe, test } from 'vitest';
import { answerDialogs } from './support/answer-dialogs';
import { GRANT_FOLDERS, SHORTCUT } from './support/e2e.constants';
import { expectSavedBeside } from './support/expect-saved-beside';
import { inFreshPlace } from './support/in-place';
import { openTilemapRig } from './support/open-tilemap-rig';
import { waitSaved } from './support/wait-saved';

const ELSEWHERE = 'elsewhere';

describe('Save As: the folder of the first file is granted, so the linked files go beside it', () => {
  test('asks for one place and writes the tilemap and its tileset in that folder', async () => {
    await inFreshPlace(async (place) => {
      const { session } = await openTilemapRig(GRANT_FOLDERS);
      try {
        await answerDialogs(session, { open: null, save: [join(place, 'level.bxmap'), join(place, ELSEWHERE, 'second.bxtiles')] });
        await session.page.keyboard.press(SHORTCUT.saveAs);
        await waitSaved(session);
        await expectSavedBeside(place, ELSEWHERE);
      } finally {
        await session.close();
      }
    });
  });
});
