/* @layer renderer-app @kind test */
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { answerDialogs } from './support/answer-dialogs';
import { GRANT_FOLDERS, SHORTCUT } from './support/e2e.constants';
import { openTilemapRig } from './support/open-tilemap-rig';
import { useRig } from './support/use-rig';
import { waitSaved } from './support/wait-saved';

const ELSEWHERE = 'elsewhere';

const savedKinds = async (dir: string): Promise<string[]> =>
  (await readdir(dir)).filter((name) => name.endsWith('.bxmap') || name.endsWith('.bxtiles')).sort();

describe('Save all: the folder of the first file is granted, so the next files go beside it', () => {
  const rig = useRig(() => openTilemapRig(GRANT_FOLDERS));

  test('asks for one place and writes the tileset and the tilemap in that folder', async () => {
    const { session } = rig();
    const first = join(session.dir, 'level.bxel');
    await answerDialogs(session, { open: null, save: [first, join(session.dir, ELSEWHERE, 'second.bxel')] });
    await session.page.keyboard.press(SHORTCUT.saveAll);
    await waitSaved(session);
    const saved = await savedKinds(session.dir);
    expect(saved).toHaveLength(2);
    expect(saved.some((name) => name.endsWith('.bxmap'))).toBe(true);
    expect(saved.some((name) => name.endsWith('.bxtiles'))).toBe(true);
    expect(await readdir(session.dir)).not.toContain(ELSEWHERE);
  });
});
