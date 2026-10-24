/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { flatIndices } from './support/flat-indices';
import { MARKS, MARKS_SIDE } from './support/marks.constants';
import { pickTransform } from './support/pick-transform';
import { openTransformRig } from './support/open-transform-rig';
import { readSaved } from './support/read-saved';
import { saveFile } from './support/save-file';
import { spriteOf } from './support/sprite-of';
import { turnGrid } from './support/turn-grid';
import { useRig } from './support/use-rig';

describe('check 4: an arbitrary angle rotation', () => {
  const rig = useRig(openTransformRig);
  const seen: { preview?: Uint8Array; committed?: Uint8Array } = {};

  test('commits nearest neighbour pixels with no new colours', async () => {
    const { session, original, shown, shownNow } = rig();
    await pickTransform(session, 'Rotate...');
    const dialog = session.page.getByRole('dialog', { name: 'Rotate' });
    await dialog.getByRole('spinbutton', { name: 'Angle in degrees' }).fill('90');
    await dialog.getByRole('button', { name: 'Preview on canvas' }).click();
    const bar = session.page.getByRole('alertdialog', { name: 'Apply bar' });
    await bar.waitFor();
    seen.preview = await shownNow();
    expect([...seen.preview]).not.toEqual([...original]);
    await bar.getByRole('button', { name: 'Apply', exact: true }).click();
    await bar.waitFor({ state: 'detached' });
    seen.committed = await shown();
    const path = join(session.dir, 'rotated.bxel');
    await saveFile(session, path);
    const saved = flatIndices(spriteOf(readSaved(path), 'sprite'));
    expect([...saved]).toEqual([...seen.committed]);
    expect([...seen.committed]).toEqual([...turnGrid(original, MARKS_SIDE)]);
    const allowed = new Set([0, ...MARKS.map(([swatch]) => swatch)]);
    expect([...saved].every((index) => allowed.has(index))).toBe(true);
  });

  test('the rotate preview shows the same pixels the commit paints', () => {
    expect([...(seen.preview ?? [])]).toEqual([...(seen.committed ?? [])]);
  });
});
