/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { addLayer } from './support/add-layer';
import { canvasMapper } from './support/canvas-mapper';
import { createSprite } from './support/create-sprite';
import { drawStroke } from './support/draw-stroke';
import type { Session } from './support/e2e.type';
import { flatIndices } from './support/flat-indices';
import { layerIndices } from './support/layer-indices';
import { openFile } from './support/open-file';
import { openSession } from './support/open-session';
import { pickSwatch } from './support/pick-swatch';
import { readDisplayed } from './support/read-displayed';
import { readSaved } from './support/read-saved';
import { readSwatches } from './support/read-swatches';
import { runMenu } from './support/run-menu';
import { saveFile } from './support/save-file';
import { shiftLayer } from './support/shift-layer';
import { spriteOf } from './support/sprite-of';

const SIZE = { width: 16, height: 16 };

const row = (y: number, from: number, to: number) => Array.from({ length: to - from + 1 }, (_, at) => ({ x: from + at, y }));

describe('check 1: a 16 slot sprite survives save and reopen', () => {
  const state: { first?: Session; second?: Session } = {};
  const dir = () => state.first?.dir ?? '';

  beforeAll(async () => {
    state.first = await openSession();
  });

  afterAll(async () => {
    await state.first?.close();
    await state.second?.close();
  });

  test('draws on two layers, merges a swatch, reorders the layers and saves', async () => {
    const session = state.first;
    if (!session) throw new Error('no session');
    await createSprite(session);
    const map = await canvasMapper(session, SIZE);
    await pickSwatch(session, 2);
    await drawStroke(session, map, row(2, 2, 5));
    await addLayer(session, 'Layer 2');
    await pickSwatch(session, 5);
    await drawStroke(session, map, row(5, 3, 6));
    await pickSwatch(session, 2);
    await runMenu(session, [/^Palette$/, /^Merge swatch/]);
    const dialog = session.page.getByRole('dialog', { name: 'Merge swatch' });
    await dialog.getByRole('combobox').click();
    await session.page.getByRole('option', { name: /Swatch 3/ }).click();
    await dialog.getByRole('button', { name: /^Merge swatches/ }).click();
    await dialog.waitFor({ state: 'detached' });
    await shiftLayer(session, 'Layer 2', 'Down');
    await saveFile(session, join(dir(), 'hero.bxel'));
    const sprite = spriteOf(readSaved(join(dir(), 'hero.bxel')), 'sprite');
    expect(sprite.layers.map((layer) => layer.name)).toEqual(['Layer 2', 'Layer 1']);
    expect([...layerIndices(sprite, 'Layer 1').filter((value) => value !== 0)]).toEqual([2, 2, 2, 2]);
    expect([...layerIndices(sprite, 'Layer 2').filter((value) => value !== 0)]).toEqual([4, 4, 4, 4]);
    const bank = readSaved(join(dir(), 'hero.bxel')).banks[0];
    expect(bank?.cap).toBe(16);
    const merged = bank?.slots[2];
    expect(merged?.kind === 'color' ? merged.rgb.toLowerCase() : null).toBe('#7b3fe4');
    const shown = await readDisplayed(session, map, SIZE, await readSwatches(session));
    expect([...shown]).toEqual([...flatIndices(sprite)]);
  });

  test('reopens with identical pixels, indices, layers and color cap', async () => {
    const saved = readSaved(join(dir(), 'hero.bxel'));
    const second = await openSession();
    state.second = second;
    await openFile(second, join(dir(), 'hero.bxel'));
    await saveFile(second, join(second.dir, 'again.bxel'));
    const again = readSaved(join(second.dir, 'again.bxel'));
    const before = spriteOf(saved, 'sprite');
    const after = spriteOf(again, 'sprite');
    expect(after.layers.map((layer) => [layer.name, layer.visible, layer.locked])).toEqual(before.layers.map((layer) => [layer.name, layer.visible, layer.locked]));
    for (const layer of before.layers) expect(layerIndices(after, layer.name)).toEqual(layerIndices(before, layer.name));
    expect(again.banks.map((bank) => [bank.cap, bank.transparent, bank.slots.length])).toEqual(saved.banks.map((bank) => [bank.cap, bank.transparent, bank.slots.length]));
    expect(again.banks.map((bank) => bank.slots)).toEqual(saved.banks.map((bank) => bank.slots));
    const map = await canvasMapper(second, SIZE);
    const shown = await readDisplayed(second, map, SIZE, await readSwatches(second));
    expect([...shown]).toEqual([...flatIndices(before)]);
  });
});
