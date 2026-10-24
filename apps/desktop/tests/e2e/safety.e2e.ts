/* @layer renderer-app @kind test */
import { chmod, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { answerDialogs } from './support/answer-dialogs';
import { buildAnimationFile } from './support/build-animation-file';
import { drawStroke } from './support/draw-stroke';
import { SHORTCUT } from './support/e2e.constants';
import { openSpriteRig } from './support/open-sprite-rig';
import { saveFile } from './support/save-file';
import { toggleLayer } from './support/toggle-layer';
import { useRig } from './support/use-rig';
import { waitText } from './support/wait-text';
import { waitUnsaved } from './support/wait-unsaved';

const mark = (y: number) => [{ x: 2, y }, { x: 3, y }, { x: 4, y }];

describe('check 8: damaged input and failed writes change nothing', () => {
  const rig = useRig(openSpriteRig);
  const painted = async () => [...await rig().shownNow()].filter((index) => index !== 0).length;

  test('a stroke on a locked layer is refused and nothing is painted', async () => {
    const { session, remap } = rig();
    await toggleLayer(session, 'Layer 1', 'Locked');
    await drawStroke(session, await remap(), mark(3));
    await waitText(session, /Layer Layer 1 is locked/);
    expect(await painted()).toBe(0);
    await toggleLayer(session, 'Layer 1', 'Locked');
    await drawStroke(session, await remap(), mark(3));
    expect(await painted()).toBe(3);
  });

  test('a truncated file is refused and the open file stays as it was', async () => {
    const { session, map } = rig();
    await drawStroke(session, map, mark(5));
    const before = await painted();
    const whole = await readFile(await buildAnimationFile(session.dir));
    const cut = join(session.dir, 'cut.bxel');
    await writeFile(cut, whole.subarray(0, Math.floor(whole.length / 2)));
    await answerDialogs(session, { open: cut, save: null });
    await session.page.keyboard.press(SHORTCUT.open);
    await waitText(session, /Could not open cut\.bxel/);
    expect(await session.page.getByText('cut.bxel - Bxel').count()).toBe(0);
    expect(await painted()).toBe(before);
  });

  test.skipIf(process.platform !== 'win32')('a save that cannot replace the file leaves the old file whole', async () => {
    const { session, map } = rig();
    const path = join(session.dir, 'keep.bxel');
    await saveFile(session, path);
    const old = await readFile(path);
    await chmod(path, 0o444);
    await drawStroke(session, map, mark(8));
    await waitUnsaved(session);
    await session.page.keyboard.press(SHORTCUT.save);
    await waitText(session, /Could not save keep\.bxel/, 60000);
    expect(Buffer.compare(await readFile(path), old)).toBe(0);
    expect((await readdir(session.dir)).filter((name) => name.startsWith('keep.bxel') && name !== 'keep.bxel')).toEqual([]);
    await waitUnsaved(session);
    await chmod(path, 0o666);
  });

  test.skip('invalid indices, out-of-bounds pixels and a disallowed path are refused over MCP (pending: the MCP server is not built yet)', () => undefined);
});
