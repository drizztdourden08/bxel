/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { frameToRgba, requireBank } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { canvasMapper } from './support/canvas-mapper';
import { exportSheetFiles } from './support/export-sheet-files';
import { flatIndices } from './support/flat-indices';
import { openAssetTab } from './support/open-asset-tab';
import { openProjectAtInUi } from './support/open-project-at-in-ui';
import { openSession } from './support/open-session';
import { assetRow } from './support/panel-assets';
import { openSheetRig, PART_NAMES } from './support/open-sheet-rig';
import { PADDED_SHEET } from './support/padded-sheet.constants';
import { readDisplayed } from './support/read-displayed';
import { readSaved } from './support/read-saved';
import { readSwatches } from './support/read-swatches';
import { setPivot } from './support/set-pivot';
import type { SheetRig } from './support/sheet-rig.type';
import { spriteOf } from './support/sprite-of';
import { useRig } from './support/use-rig';

const SIDE = PADDED_SHEET.cell;

const PADDING = 1;

const PIVOT = { x: 1.5, y: 4 } as const;

const saved = (rig: SheetRig, name: string) => readSaved(join(rig.root, 'sprites', `${name}.bxsprite`));

const opaque = (data: ArrayLike<number>, at: number): number[] => ((data[at * 4 + 3] ?? 0) === 0 ? [0] : [data[at * 4] ?? 0, data[at * 4 + 1] ?? 0, data[at * 4 + 2] ?? 0]);

const exportsRectanglesAndPivots = async (rig: SheetRig): Promise<void> => {
  await setPivot(rig.session, PART_NAMES[1], PIVOT.x, PIVOT.y);
  await rig.saveAll();
  await expect.poll(() => spriteOf(saved(rig, PART_NAMES[1]), PART_NAMES[1]).pivot, { timeout: 15000 }).toEqual({ x2: PIVOT.x * 2, y2: PIVOT.y * 2 });
  const { image, json } = await exportSheetFiles(rig.session, rig.root, 'Sheets', PART_NAMES.length);
  const stride = SIDE + PADDING;
  expect([image.width, image.height]).toEqual([PART_NAMES.length * stride - PADDING, SIDE]);
  const entries = json['sprites'] as { name: string; size: { w: number; h: number }; pivot: { x2: number; y2: number }; frames: { frame: { x: number; y: number; w: number; h: number } }[] }[];
  expect(entries.map((entry) => entry.name)).toEqual([...PART_NAMES]);
  PART_NAMES.forEach((name, at) => {
    const artwork = saved(rig, name);
    const sprite = spriteOf(artwork, name);
    const entry = entries[at];
    expect(entry?.size, `${name} size`).toEqual({ w: SIDE, h: SIDE });
    expect(entry?.pivot, `${name} pivot`).toEqual(sprite.pivot);
    expect(entry?.frames[0]?.frame, `${name} rectangle`).toEqual({ x: at * stride, y: 0, w: SIDE, h: SIDE });
    const expected = frameToRgba(sprite, requireBank(artwork, sprite.bankId), sprite.frames[0]?.id ?? ('' as never));
    for (let cell = 0; cell < SIDE * SIDE; cell += 1) {
      const got = (cell % SIDE + at * stride) + Math.floor(cell / SIDE) * image.width;
      expect(opaque(image.data, got), `${name} pixel ${cell}`).toEqual(opaque(expected, cell));
    }
  });
  expect(entries[1]?.pivot).toEqual({ x2: 3, y2: 8 });
  expect(entries[0]?.pivot).toEqual({ x2: SIDE, y2: SIDE });
  expect(json['image']).toBe('Sheets.png');
};

const reopensIdentical = async (rig: SheetRig): Promise<void> => {
  const second = await openSession();
  try {
    await openProjectAtInUi(second, rig.root, 'Sheets');
    for (const name of PART_NAMES) await assetRow(second, name).waitFor();
    await assetRow(second, 'part_02').click();
    await openAssetTab(second, /^part_02/).waitFor();
    const size = { width: SIDE, height: SIDE };
    const map = await canvasMapper(second, size);
    const sprite = spriteOf(saved(rig, 'part_02'), 'part_02');
    expect([...await readDisplayed(second, map, size, await readSwatches(second))]).toEqual([...flatIndices(sprite)]);
    await second.page.getByRole('combobox', { name: 'Sheet' }).getByText('padded-sheet (3)').waitFor();
  } finally {
    await second.close();
  }
};

describe('check 5: pivots, export and reopen of the sheet', () => {
  const rig = useRig(openSheetRig);
  test('exports the PNG and JSON with the exact rectangles, pixels and pivots', () => exportsRectanglesAndPivots(rig()));
  test('reopens the project with the same three sprites and the same pixels', () => reopensIdentical(rig()));
});
