/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { expectAnnounced } from './support/expect-announced';
import { openSpriteRig } from './support/open-sprite-rig';
import { useRig } from './support/use-rig';

describe('the tools toolbar and the tool options bar', () => {
  const rig = useRig(openSpriteRig);

  test('shows the variant of a slot in its name', async () => {
    const { page } = rig().session;
    const tools = page.getByRole('toolbar', { name: 'Tools' });
    await tools.getByRole('button', { name: 'Shapes, Line' }).waitFor();
    await tools.getByRole('button', { name: 'Pencil' }).waitFor();
  });

  test('cycles the shape kind with U, the selection shapes with M and back with Shift+M', async () => {
    const { page } = rig().session;
    const tools = page.getByRole('toolbar', { name: 'Tools' });
    await page.getByRole('application', { name: 'Sprite canvas' }).focus();
    await page.keyboard.press('u');
    await page.keyboard.press('u');
    await tools.getByRole('button', { name: 'Shapes, Rectangle' }).waitFor();
    await expectAnnounced(rig().session, 'Rectangle tool');
    await page.keyboard.press('m');
    await page.keyboard.press('m');
    await expectAnnounced(rig().session, 'Ellipse tool');
    await page.keyboard.press('Shift+m');
    await expectAnnounced(rig().session, 'Rectangle tool');
  });

  test('opens the tool menu with a right click and closes it with Escape', async () => {
    const { page } = rig().session;
    await page.getByRole('toolbar', { name: 'Tools' }).getByRole('button', { name: /^Shapes/ }).click({ button: 'right' });
    await page.getByRole('menuitemradio', { name: 'Ellipse' }).waitFor();
    const box = await page.getByRole('menu').first().boundingBox();
    const height = await page.evaluate(() => window.innerHeight);
    expect(box?.y).toBeGreaterThanOrEqual(0);
    expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(height);
    await page.keyboard.press('Escape');
    await expect.poll(() => page.getByRole('menuitemradio', { name: 'Ellipse' }).count()).toBe(0);
  });

  test('applies a preset with Alt+2 and shows its name on the chip', async () => {
    const { page } = rig().session;
    await page.getByRole('application', { name: 'Sprite canvas' }).focus();
    await page.keyboard.press('b');
    const options = page.getByRole('toolbar', { name: 'Tool options' });
    await options.getByRole('button', { name: /^Pencil, Custom/ }).waitFor();
    await page.keyboard.press('Alt+2');
    await options.getByRole('button', { name: /^Pencil, Pencil 2 px, square/ }).waitFor();
  });

  test('keeps the brush size of each tool apart', async () => {
    const { page } = rig().session;
    await page.getByRole('application', { name: 'Sprite canvas' }).focus();
    await page.keyboard.press('b');
    await page.keyboard.press(']');
    await page.keyboard.press('e');
    const size = page.getByRole('toolbar', { name: 'Tool options' }).getByRole('spinbutton', { name: 'Brush size' });
    await expect.poll(() => size.inputValue()).toBe('1');
    await page.keyboard.press('b');
    await expect.poll(() => size.inputValue()).toBe('3');
  });
});
