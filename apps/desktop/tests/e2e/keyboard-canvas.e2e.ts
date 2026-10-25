/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { expectAnnounced } from './support/expect-announced';
import { SHORTCUT } from './support/e2e.constants';
import { MARKS_SIDE } from './support/marks.constants';
import { openSpriteRig } from './support/open-sprite-rig';
import { saveFile } from './support/save-file';
import { useRig } from './support/use-rig';
import { waitStatus } from './support/wait-status';

const filled = (grid: Uint8Array) => [...grid].flatMap((index, at) => (index === 0 ? [] : [`${at % MARKS_SIDE},${Math.floor(at / MARKS_SIDE)}`])).sort();

describe('accessibility: drawing on the canvas with the keyboard alone', () => {
  const rig = useRig(openSpriteRig);

  test('the arrow keys move a cursor cell and Space paints it', async () => {
    const { session, shown } = rig();
    const { page } = session;
    const canvas = page.getByRole('application', { name: 'Sprite canvas' });
    await canvas.focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
    await waitStatus(session, /Cursor\s+x 9, y 9/);
    await page.keyboard.press(' ');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Shift+ ');
    expect(filled(await shown())).toEqual(['9,10', '9,9']);
    await page.keyboard.press(SHORTCUT.undo);
    expect(filled(await shown())).toEqual(['9,9']);
  });

  test('the canvas says the cell it moves to', async () => {
    const { session } = rig();
    const { page } = session;
    await page.getByRole('application', { name: 'Sprite canvas' }).focus();
    await page.keyboard.press('ArrowLeft');
    await expectAnnounced(session, /^x \d+, y \d+/);
  });

  test('a tool change is announced', async () => {
    const { session } = rig();
    await session.page.keyboard.press('e');
    await expectAnnounced(session, 'Eraser tool');
  });

  test('a save is announced', async () => {
    const { session } = rig();
    await session.page.getByRole('application', { name: 'Sprite canvas' }).focus();
    await session.page.keyboard.press('ArrowLeft');
    await session.page.keyboard.press('Enter');
    await saveFile(session, join(session.dir, 'announced.bxsprite'));
    await expectAnnounced(session, 'Saved announced.bxsprite');
  });
});
