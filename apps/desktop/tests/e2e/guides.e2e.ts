/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { SHORTCUT } from './support/e2e.constants';
import type { Session } from './support/e2e.type';
import { drag } from './support/drag-pointer';
import { MARKS_SIDE } from './support/marks.constants';
import { openSpriteRig } from './support/open-sprite-rig';
import { readSaved } from './support/read-saved';
import type { RulerName } from './support/ruler-centre';
import { centreOf } from './support/ruler-centre';
import { saveFile } from './support/save-file';
import { shoot } from './support/shoot';
import { useRig } from './support/use-rig';

const menuItem = (session: Session, name: RegExp) => session.page.getByRole('menu').getByRole('menuitem', { name });

const radioItem = (session: Session, name: RegExp) => session.page.getByRole('menu').getByRole('menuitemradio', { name });

const ruler = (session: Session, name: RulerName) => session.page.getByRole('button', { name });

const press = async (session: Session, chord: string): Promise<void> => {
  await session.page.getByRole('application', { name: 'Sprite canvas' }).focus();
  await session.page.keyboard.press(chord);
};

let saves = 0;

const guidesNow = async (session: Session) => {
  saves += 1;
  const path = join(session.dir, `guides-${saves}.bxsprite`);
  await saveFile(session, path);
  return readSaved(path).sprites[0]?.guides;
};

describe('guides: pulled out of the rulers, moved, removed and cleared', () => {
  const rig = useRig(openSpriteRig);

  test('a drag from the left ruler adds a vertical guide, a drag on the canvas moves it, a drag back onto the ruler removes it', async () => {
    const { session, map } = rig();
    const middle = MARKS_SIDE / 2;
    const at = (line: number) => map({ x: line - 0.5, y: middle });
    await drag(session, await centreOf(session, 'Vertical ruler'), at(4));
    expect(await guidesNow(session)).toEqual({ x: [4], y: [] });
    await shoot(session, 'guides-added');
    await drag(session, at(4), at(10));
    expect(await guidesNow(session)).toEqual({ x: [10], y: [] });
    await drag(session, at(10), await centreOf(session, 'Vertical ruler'));
    expect(await guidesNow(session)).toBeUndefined();
  });

  test('a drag from the top ruler adds a horizontal guide, and Undo and Redo walk through the guide edits', async () => {
    const { session, map } = rig();
    const top = await centreOf(session, 'Horizontal ruler');
    await drag(session, top, map({ x: 8, y: 5.5 }));
    expect(await guidesNow(session)).toEqual({ x: [], y: [6] });
    await drag(session, top, map({ x: 8, y: 2.5 }));
    await press(session, SHORTCUT.undo);
    expect(await guidesNow(session)).toEqual({ x: [], y: [6] });
    await drag(session, top, map({ x: 8, y: 2.5 }));
    await press(session, SHORTCUT.undo);
    await press(session, SHORTCUT.redo);
    expect(await guidesNow(session)).toEqual({ x: [], y: [3, 6] });
  });

  test('the ruler menu adds a guide here and clears the guides, and both undo', async () => {
    const { session } = rig();
    await ruler(session, 'Horizontal ruler').click({ button: 'right' });
    await expect(menuItem(session, /^Clear guides/).isDisabled()).resolves.toBe(false);
    await menuItem(session, /^Clear guides/).click();
    await ruler(session, 'Horizontal ruler').click({ button: 'right' });
    await expect(menuItem(session, /^Clear guides/).isDisabled()).resolves.toBe(true);
    await menuItem(session, /^Add guide here/).click();
    await ruler(session, 'Vertical ruler').click({ button: 'right' });
    await menuItem(session, /^Clear guides/).click();
    await press(session, SHORTCUT.undo);
    const kept = await guidesNow(session);
    expect(kept?.x).toHaveLength(1);
    expect(kept?.y).toEqual([]);
  });

  test('the Guides toggle hides the guides without removing them', async () => {
    const { session } = rig();
    const toggle = session.page.getByRole('button', { name: /^Guides/ }).first();
    await toggle.waitFor();
    const before = await toggle.getAttribute('aria-pressed');
    await shoot(session, 'guides-shown');
    await toggle.click();
    expect(await toggle.getAttribute('aria-pressed')).not.toBe(before);
    await shoot(session, 'guides-hidden');
    expect((await guidesNow(session))?.x).toHaveLength(1);
    await toggle.click();
    expect(await toggle.getAttribute('aria-pressed')).toBe(before);
  });
});

describe('ruler units: a submenu on the ruler menu, kept as an app setting', () => {
  const rig = useRig(openSpriteRig);

  test('the Units submenu switches the unit and remembers it', async () => {
    const { session } = rig();
    const { page } = session;
    await ruler(session, 'Horizontal ruler').click({ button: 'right' });
    await menuItem(session, /^Units/).click();
    await expect(radioItem(session, /^Pixels/).getAttribute('aria-checked')).resolves.toBe('true');
    await radioItem(session, /^Percent/).click();
    await shoot(session, 'ruler-percent');
    await ruler(session, 'Vertical ruler').click({ button: 'right' });
    await menuItem(session, /^Units/).click();
    await expect(radioItem(session, /^Percent/).getAttribute('aria-checked')).resolves.toBe('true');
    await radioItem(session, /^Tiles/).click();
    await shoot(session, 'ruler-tiles');
    await ruler(session, 'Horizontal ruler').click({ button: 'right' });
    await menuItem(session, /^Units/).click();
    await expect(radioItem(session, /^Tiles/).getAttribute('aria-checked')).resolves.toBe('true');
    await radioItem(session, /^Pixels/).click();
    await page.keyboard.press('Escape');
  });
});
