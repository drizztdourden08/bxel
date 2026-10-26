/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import type { Session } from './support/e2e.type';
import { openSpriteRig } from './support/open-sprite-rig';
import { useRig } from './support/use-rig';

const filled = (grid: Uint8Array): number => [...grid].filter((index) => index !== 0).length;

const menuItem = (session: Session, name: RegExp) => session.page.getByRole('menu').getByRole('menuitem', { name });

describe('context menus: opened by a right click and by the keyboard, each running an item', () => {
  const rig = useRig(openSpriteRig);

  test('the canvas menu runs Undo from a right click with the Hand tool', async () => {
    const { session, shown } = rig();
    const { page } = session;
    const canvas = page.getByRole('application', { name: 'Sprite canvas' });
    await canvas.focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press(' ');
    expect(filled(await shown())).toBe(1);
    await page.keyboard.press('h');
    await canvas.click({ button: 'right' });
    await menuItem(session, /^Undo/).click();
    expect(filled(await shown())).toBe(0);
    await page.keyboard.press('b');
  });

  test('the canvas menu runs Undo from Shift+F10 at the keyboard cursor', async () => {
    const { session, shown } = rig();
    const { page } = session;
    await page.getByRole('application', { name: 'Sprite canvas' }).focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press(' ');
    expect(filled(await shown())).toBe(1);
    await page.keyboard.press('Shift+F10');
    await menuItem(session, /^Undo/).click();
    expect(filled(await shown())).toBe(0);
  });

  test('the tab menu opens the Export dialog from a right click and from the keyboard', async () => {
    const { session } = rig();
    const { page } = session;
    const tab = page.getByRole('tablist', { name: 'Open assets' }).getByRole('tab').first();
    await tab.click({ button: 'right' });
    await menuItem(session, /^Export/).click();
    const dialog = page.getByRole('dialog', { name: 'Export' });
    await dialog.waitFor();
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    await tab.focus();
    await page.keyboard.press('Shift+F10');
    await menuItem(session, /^Export/).click();
    await dialog.waitFor();
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
  });

  test('the layer menu adds a layer from a right click and duplicates one from the keyboard', async () => {
    const { session } = rig();
    const { page } = session;
    const rows = page.getByRole('region', { name: 'Layers' }).getByRole('list', { name: 'Layers' }).getByRole('listitem');
    const before = await rows.count();
    await rows.first().getByRole('button').first().click({ button: 'right' });
    await menuItem(session, /^New layer/).click();
    await expect.poll(() => rows.count()).toBe(before + 1);
    await rows.first().getByRole('button').first().focus();
    await page.keyboard.press('Shift+F10');
    await menuItem(session, /^Duplicate layer/).click();
    await expect.poll(() => rows.count()).toBe(before + 2);
  });
});
