/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { drawStroke } from './support/draw-stroke';
import { openSpriteRig } from './support/open-sprite-rig';
import { readSaved } from './support/read-saved';
import { saveFile } from './support/save-file';
import { useRig } from './support/use-rig';

const edge = (value: number) => ({ x: value - 0.5, y: value - 0.5 });

const savedSprite = async (rig: { session: Parameters<typeof saveFile>[0] }, name: string) => {
  const path = join(rig.session.dir, name);
  await saveFile(rig.session, path);
  const sprite = readSaved(path).sprites[0];
  if (!sprite) throw new Error('the saved file has no sprite');
  return sprite;
};

describe('the slice tool and the mirror axes saved with the sprite', () => {
  const rig = useRig(openSpriteRig);

  test('a drag with the Slice tool cuts a slice, and its properties dialog sets a pivot and a 9-slice centre', async () => {
    const { session, map } = rig();
    const { page } = session;
    await page.getByRole('application', { name: 'Sprite canvas' }).focus();
    await page.keyboard.press('Shift+c');
    await drawStroke(session, map, [edge(2), edge(8)]);
    const first = map({ x: 4, y: 4 });
    await page.mouse.dblclick(first.x, first.y);
    const dialog = page.getByRole('dialog', { name: 'Slice properties' });
    await dialog.waitFor();
    await dialog.getByText('Has a pivot', { exact: true }).click();
    await dialog.getByText('Has a 9-slice centre', { exact: true }).click();
    await dialog.getByRole('button', { name: 'Apply' }).click();
    await dialog.waitFor({ state: 'detached' });
    const sprite = await savedSprite(rig(), 'sliced.bxsprite');
    expect(sprite.slices).toHaveLength(1);
    const slice = sprite.slices[0];
    const rect = slice?.rect;
    expect(rect).toMatchObject({ x: 2, y: 2 });
    expect(rect?.width).toBeGreaterThanOrEqual(5);
    expect(rect?.height).toBeGreaterThanOrEqual(5);
    expect(slice?.pivot).toEqual({ x2: rect?.width, y2: rect?.height });
    expect(slice?.center).toEqual({ x: 0, y: 0, width: rect?.width, height: rect?.height });
  });

  test('Delete removes the selected slice and Undo brings it back', async () => {
    const { session, map } = rig();
    const { page } = session;
    const inside = map({ x: 4, y: 4 });
    await page.mouse.click(inside.x, inside.y);
    await page.keyboard.press('Delete');
    expect((await savedSprite(rig(), 'deleted.bxsprite')).slices).toHaveLength(0);
    await page.keyboard.press('Control+z');
    await page.keyboard.press('Control+z');
    expect((await savedSprite(rig(), 'restored.bxsprite')).slices).toHaveLength(1);
  });

  test('the mirror axis is written to the sprite file and the sprite loads it back', async () => {
    const { session } = rig();
    const { page } = session;
    await page.getByRole('button', { name: /^Mirror Y/ }).click();
    const sprite = await savedSprite(rig(), 'mirrored.bxsprite');
    expect(sprite.symmetry).toMatchObject({ y: true, x: false });
    await page.getByRole('button', { name: /^Mirror Y/ }).click();
    expect((await savedSprite(rig(), 'plain.bxsprite')).symmetry).toBeUndefined();
  });
});
