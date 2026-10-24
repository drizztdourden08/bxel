/* @layer tests @kind test */
import { sheetImportSteps } from '@bxel/palette';
import type { SheetImportCell } from '@bxel/palette';
import { describe, expect, it } from 'vitest';
import { makeNoiseImage } from './make-noise-image';
import { execute, makeRig, rejectionCode, succeed } from './palette-engine';
import type { Rig } from './palette-engine';
import { redoLast, undoLast } from './import-helpers';

const CELL = 4;
const PAD = 1;

const cellAt = (column: number, row: number, name: string): SheetImportCell => {
  const picture = makeNoiseImage(CELL, column + row * 5);
  return {
    name,
    image: { width: CELL, height: CELL, rgba: Uint8Array.from(picture.data) },
    source: { x: PAD + column * (CELL + PAD), y: PAD + row * (CELL + PAD), width: CELL, height: CELL },
  };
};

const request = (rig: Rig, cells: readonly SheetImportCell[], sheetName = 'strip') => ({
  sheetName,
  layout: { kind: 'grid', columns: 3, cellWidth: CELL, cellHeight: CELL, order: 'rows' } as const,
  spacing: { x: PAD, y: PAD },
  margin: PAD,
  bank: { bankId: rig.bankId },
  cells,
});

const sixCells = (): SheetImportCell[] =>
  Array.from({ length: 6 }, (_, index) => cellAt(index % 3, Math.floor(index / 3), `cell ${index + 1}`));

describe('sheet import steps', () => {
  it('imports every cell and puts it on a new sheet in one undo step', () => {
    const rig = makeRig();
    const before = rig.engine.state().artwork;
    const result = succeed(execute(rig, sheetImportSteps(request(rig, sixCells()))));
    const artwork = rig.engine.state().artwork;
    expect(result.ok && result.created['sheet-import']).toBe(artwork.sheets[0]?.id);
    expect(artwork.sprites.map((sprite) => sprite.name)).toEqual(['hero', ...sixCells().map((cell) => cell.name)]);
    expect(artwork.sheets).toHaveLength(1);
    expect(undoLast(rig).ok).toBe(true);
    expect(rig.engine.state().artwork.sprites).toEqual(before.sprites);
    expect(rig.engine.state().artwork.sheets).toEqual([]);
    expect(redoLast(rig).ok).toBe(true);
    expect(rig.engine.state().artwork.sheets[0]?.entries).toHaveLength(6);
  });

  it('keeps the padded rectangle of each cell as its place and source', () => {
    const rig = makeRig();
    succeed(execute(rig, sheetImportSteps(request(rig, sixCells()))));
    const sheet = rig.engine.state().artwork.sheets[0];
    expect(sheet?.layout).toEqual({ kind: 'grid', columns: 3, cellWidth: CELL, cellHeight: CELL, order: 'rows' });
    expect(sheet?.spacing).toEqual({ x: PAD, y: PAD });
    expect(sheet?.margin).toBe(PAD);
    const places = sheet?.entries.map((entry) => `${entry.at.x},${entry.at.y}`);
    expect(places).toEqual(['1,1', '6,1', '11,1', '1,6', '6,6', '11,6']);
    expect(sheet?.entries.map((entry) => entry.source)).toEqual(sixCells().map((cell) => cell.source));
  });

  it('adds more than 64 sprites with several sheet.add steps', () => {
    const rig = makeRig();
    const cells = Array.from({ length: 70 }, (_, index) => cellAt(index % 10, Math.floor(index / 10), `tile ${index + 1}`));
    const steps = sheetImportSteps({ ...request(rig, cells), layout: { kind: 'manual' } });
    expect(steps.filter((item) => item.name === 'sheet.add')).toHaveLength(2);
    succeed(execute(rig, steps));
    expect(rig.engine.state().artwork.sheets[0]?.entries).toHaveLength(70);
  });

  it('commits nothing when one cell fails', () => {
    const rig = makeRig();
    const cells = [...sixCells(), { ...cellAt(0, 0, 'hero'), source: { x: 0, y: 0, width: CELL, height: CELL } }];
    expect(rejectionCode(rig, () => execute(rig, sheetImportSteps(request(rig, cells))))).toBe('NAME_TAKEN');
    expect(rig.engine.state().artwork.sheets).toEqual([]);
    expect(rig.engine.state().artwork.sprites).toHaveLength(1);
  });

  it('refuses a sheet name that is taken', () => {
    const rig = makeRig();
    succeed(execute(rig, sheetImportSteps(request(rig, sixCells()))));
    const more = [cellAt(0, 0, 'extra')];
    expect(rejectionCode(rig, () => execute(rig, sheetImportSteps(request(rig, more))))).toBe('NAME_TAKEN');
  });
});
