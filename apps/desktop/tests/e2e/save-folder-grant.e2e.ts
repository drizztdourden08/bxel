/* @layer renderer-app @kind test */
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { answerDialogs } from './support/answer-dialogs';
import { GRANT_FOLDERS, SHORTCUT } from './support/e2e.constants';
import { inFreshPlace } from './support/in-place';
import { openTilemapRig } from './support/open-tilemap-rig';
import { waitSaved } from './support/wait-saved';

const ELSEWHERE = 'elsewhere';

const savedKinds = async (dir: string): Promise<string[]> =>
  (await readdir(dir)).filter((name) => name.endsWith('.bxmap') || name.endsWith('.bxtiles')).sort();

describe('Save all: the folder of the first file is granted, so the next files go beside it', () => {
  test('asks for one place and writes the tileset and the tilemap in that folder', async () => {
    await inFreshPlace(async (place) => {
      const { session } = await openTilemapRig(GRANT_FOLDERS);
      try {
        await answerDialogs(session, { open: null, save: [join(place, 'level.bxtiles'), join(place, ELSEWHERE, 'second.bxmap')] });
        await session.page.keyboard.press(SHORTCUT.saveAll);
        await waitSaved(session);
        const saved = await savedKinds(place);
        expect(saved).toHaveLength(2);
        expect(saved.some((name) => name.endsWith('.bxmap'))).toBe(true);
        expect(saved.some((name) => name.endsWith('.bxtiles'))).toBe(true);
        expect(await readdir(place)).not.toContain(ELSEWHERE);
      } finally {
        await session.close();
      }
    });
  });
});
