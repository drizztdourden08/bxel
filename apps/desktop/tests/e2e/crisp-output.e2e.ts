/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { frameToRgba, requireBank } from '@bxel/document';
import { decodePng } from '@bxel/formats';
import { describe, expect, test } from 'vitest';
import { drawStroke } from './support/draw-stroke';
import { exportSpritePng } from './support/export-sprite-png';
import { MARKS_SIDE } from './support/marks.constants';
import { openSpriteRig } from './support/open-sprite-rig';
import { pickSwatch } from './support/pick-swatch';
import { readSaved } from './support/read-saved';
import { readSwatches } from './support/read-swatches';
import { sampleCanvas } from './support/sample-canvas';
import { saveFile } from './support/save-file';
import { spriteOf } from './support/sprite-of';
import { useRig } from './support/use-rig';

const SIDE = MARKS_SIDE;

const SCALE = 3;

const ROWS = [1, 5, 9, 13];

const COLUMNS = [3, 7, 11, 15];

const ZOOM_STEPS = ['', 'Minus', 'Minus', 'Control+0', 'Control+1', '=', '=', '=', '='];

const line = (from: { x: number; y: number }, to: { x: number; y: number }) => [from, to];

describe('release blocker: pixel output is never blurred', () => {
  const rig = useRig(openSpriteRig);

  test('the canvas shows only palette colours at every zoom, with no blend at a pixel edge', async () => {
    const { session, map, remap } = rig();
    await pickSwatch(session, 2);
    await session.page.keyboard.press('g');
    await drawStroke(session, map, [{ x: 0, y: 0 }]);
    await session.page.keyboard.press('b');
    await pickSwatch(session, 3);
    for (const y of ROWS) await drawStroke(session, map, line({ x: 0, y }, { x: SIDE - 1, y }));
    await pickSwatch(session, 4);
    for (const x of COLUMNS) await drawStroke(session, map, line({ x, y: 0 }, { x, y: SIDE - 1 }));
    await session.page.getByRole('button', { name: 'Pixel grid' }).click();
    const allowed = new Set((await readSwatches(session)).slice(2, 5));
    for (const chord of ZOOM_STEPS) {
      if (chord !== '') await session.page.keyboard.press(chord);
      const at = await remap();
      const first = at({ x: 0, y: 0 });
      const last = at({ x: SIDE - 1, y: SIDE - 1 });
      const half = (at({ x: 1, y: 0 }).x - first.x) / 2 - 0.5;
      const points = [];
      for (let y = Math.ceil(first.y - half); y <= Math.floor(last.y + half); y += 1) {
        for (let x = Math.ceil(first.x - half); x <= Math.floor(last.x + half); x += 1) points.push({ x, y });
      }
      const seen = new Set(await sampleCanvas(session, points));
      expect([...seen].filter((colour) => !allowed.has(colour)), `zoom step ${chord}`).toEqual([]);
      expect(seen.size, `zoom step ${chord} still shows all three colours`).toBe(3);
    }
  });

  test('a PNG export at a whole number scale repeats each pixel and adds no colour', async () => {
    const { session } = rig();
    const source = join(session.dir, 'weave.bxsprite');
    await saveFile(session, source);
    const artwork = readSaved(source);
    const sprite = spriteOf(artwork, 'weave');
    const expected = frameToRgba(sprite, requireBank(artwork, sprite.bankId), sprite.frames[0]?.id ?? ('' as never));
    const bytes = await exportSpritePng(session, SCALE);
    const png = decodePng(bytes);
    if (!png.ok) throw new Error(png.message);
    expect([png.width, png.height]).toEqual([SIDE * SCALE, SIDE * SCALE]);
    for (let y = 0; y < png.height; y += 1) {
      for (let x = 0; x < png.width; x += 1) {
        const got = [...png.data.slice((y * png.width + x) * 4, (y * png.width + x) * 4 + 4)];
        const from = (Math.floor(y / SCALE) * SIDE + Math.floor(x / SCALE)) * 4;
        expect(got, `pixel ${x},${y}`).toEqual([...expected.slice(from, from + 4)]);
      }
    }
  });
});
