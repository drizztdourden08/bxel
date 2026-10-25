/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import type { Session } from './support/e2e.type';
import { expectAnnounced } from './support/expect-announced';
import { focusedRegion } from './support/focused-region';
import { openSpriteRig } from './support/open-sprite-rig';
import { useRig } from './support/use-rig';

const EXPECTED = ['Canvas', 'Tool options', 'Tools', 'Open assets', 'Sprite canvas', 'Palette', 'Layers', 'Sheet', 'Tileset', 'Timeline'];

const MAX_STOPS = 20;

const activeLabel = (session: Session): Promise<string | null | undefined> =>
  session.page.evaluate(() => document.activeElement?.getAttribute('aria-label'));

const walk = async (session: Session, key: string): Promise<string[]> => {
  const seen: string[] = [];
  for (let stop = 0; stop < MAX_STOPS; stop += 1) {
    await session.page.keyboard.press(key);
    seen.push(await focusedRegion(session));
  }
  return seen;
};

describe('accessibility: moving between regions and inside toolbars by keyboard', () => {
  const rig = useRig(openSpriteRig);

  test('F6 visits every toolbar, tab strip, canvas and panel, then wraps', async () => {
    const { session } = rig();
    await session.page.getByRole('application', { name: 'Sprite canvas' }).focus();
    const seen = await walk(session, 'F6');
    for (const name of EXPECTED) expect(seen, name).toContain(name);
    expect(new Set(seen).size).toBeLessThanOrEqual(EXPECTED.length + 1);
  });

  test('Shift+F6 walks the same regions backwards', async () => {
    const { session } = rig();
    await session.page.getByRole('application', { name: 'Sprite canvas' }).focus();
    await session.page.keyboard.press('F6');
    const after = await focusedRegion(session);
    await session.page.keyboard.press('Shift+F6');
    expect(await focusedRegion(session)).toBe('Sprite canvas');
    expect(after).not.toBe('Sprite canvas');
  });

  test('the arrow keys move along the vertical Tools toolbar and Enter presses a button', async () => {
    const { session } = rig();
    const { page } = session;
    const toolbar = page.getByRole('toolbar', { name: 'Tools' });
    await toolbar.getByRole('button', { name: 'Pencil' }).focus();
    await page.keyboard.press('ArrowDown');
    await expect.poll(() => activeLabel(session)).toBe('Eraser');
    await page.keyboard.press('Enter');
    await expect.poll(() => toolbar.getByRole('button', { name: 'Eraser' }).getAttribute('aria-pressed')).toBe('true');
  });

  test('Escape closes a menu and puts focus back on its button', async () => {
    const { session } = rig();
    const { page } = session;
    const button = page.getByRole('toolbar', { name: 'Canvas' }).getByRole('button', { name: 'Transform' });
    await button.focus();
    await page.keyboard.press('Enter');
    await page.getByRole('menu').first().waitFor();
    await page.keyboard.press('Escape');
    await page.getByRole('menu').first().waitFor({ state: 'detached' });
    await expect.poll(() => activeLabel(session)).toBe('Transform');
  });

  test('a tool change is announced politely', async () => {
    const { session } = rig();
    await session.page.keyboard.press('b');
    await session.page.keyboard.press('e');
    await expectAnnounced(session, 'Eraser tool');
  });
});
