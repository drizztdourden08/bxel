/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { drawStroke } from './support/draw-stroke';
import { SHORTCUT } from './support/e2e.constants';
import type { Session } from './support/e2e.type';
import { openFile } from './support/open-file';
import { openSession } from './support/open-session';
import { openSpriteRig } from './support/open-sprite-rig';
import { pickSwatch } from './support/pick-swatch';
import { readSaved } from './support/read-saved';
import { readSwatches } from './support/read-swatches';
import { sampleCanvas } from './support/sample-canvas';
import { saveFile } from './support/save-file';
import { useRig } from './support/use-rig';

const SWATCH = 3;

const NEW_HEX = '#e0a030';

const CELLS = [{ x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }];

const swatchLabel = (session: Session, index: number) =>
  session.page.getByRole('region', { name: 'Palette' }).getByRole('button', { name: new RegExp(`^Swatch ${index},`) });

describe('check 1: editing a swatch colour recolours every pixel that uses it', () => {
  const rig = useRig(openSpriteRig);
  const colours = async () => sampleCanvas(rig().session, CELLS.map(rig().map));

  test('a new colour reaches every pixel and the indices stay', async () => {
    const { session, map, shown } = rig();
    await pickSwatch(session, SWATCH);
    await drawStroke(session, map, CELLS);
    const indices = [...await shown()];
    const before = await colours();
    expect(new Set(before).size).toBe(1);
    await swatchLabel(session, SWATCH).dblclick();
    await session.page.getByRole('textbox', { name: 'Hex' }).fill(NEW_HEX.slice(1));
    await session.page.keyboard.press('Escape');
    await session.page.getByRole('region', { name: 'Palette' }).getByRole('button', { name: new RegExp(`^Swatch ${SWATCH}, .*${NEW_HEX}`, 'i') }).waitFor();
    expect(await colours()).toEqual(CELLS.map(() => NEW_HEX));
    expect([...await shown()]).toEqual(indices);
    await session.page.keyboard.press(SHORTCUT.undo);
    await session.page.getByRole('region', { name: 'Palette' }).getByRole('button', { name: new RegExp(`^Swatch ${SWATCH}, .*${before[0]}`, 'i') }).waitFor();
    expect(await colours()).toEqual(before);
    await session.page.keyboard.press(SHORTCUT.redo);
    expect(await colours()).toEqual(CELLS.map(() => NEW_HEX));
  });

  test('saves and reopens with the new colour, the same indices and the same cap', async () => {
    const { session, shown } = rig();
    const path = join(session.dir, 'swatch.bxsprite');
    const indices = [...await shown()];
    await saveFile(session, path);
    const saved = readSaved(path);
    const bank = saved.banks[0];
    const slot = bank?.slots[SWATCH];
    expect(slot?.kind === 'color' ? slot.rgb.toLowerCase() : null).toBe(NEW_HEX);
    expect(bank?.cap).toBe(16);
    const second = await openSession();
    try {
      await openFile(second, path);
      const swatches = await readSwatches(second);
      expect(swatches[SWATCH]).toBe(NEW_HEX);
      expect(indices.filter((index) => index === SWATCH)).toHaveLength(CELLS.length);
    } finally {
      await second.close();
    }
  });
});
