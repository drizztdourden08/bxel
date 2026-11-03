/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { FORM_BASE } from '../../src/image-import/image-import.constants';
import type { ImportRun } from '../../src/image-import/image-import.type';
import { importSteps } from '../../src/image-import/import-steps';
import { useImportStore } from '../../src/stores/useImportStore';

const image = { fileName: 'hero.png', width: 4, height: 2, data: new Uint8ClampedArray(4 * 2 * 4).fill(255) };

const run: ImportRun = {
  form: { ...FORM_BASE, kind: 'sprite', target: 'file', name: 'hero' },
  image,
  plan: { palette: [], transparent: true, limit: 16, bank: null, bankId: 'bank-1', dropped: 0 },
  rects: [
    { index: 0, x: 0, y: 0, width: 2, height: 2 },
    { index: 1, x: 2, y: 0, width: 2, height: 2 },
  ],
  names: ['hero_1', 'hero_2'],
  context: { documentId: null, bank: null, taken: [], animationNames: [], sheetNames: [], tilesetNames: [], tilemapNames: [], spriteCount: 0 },
  tiled: null,
};

describe('H1 an image dropped on the sheet puts its sprites on that sheet', { tags: ['standard'] }, () => {
  beforeEach(() => useImportStore.getState().hide());

  it('keeps the sheet it was dropped on until the dialog closes', () => {
    useImportStore.getState().show(image, undefined, undefined, 'sheet-1');
    expect(useImportStore.getState().sheetId).toBe('sheet-1');
    useImportStore.getState().hide();
    expect(useImportStore.getState().sheetId).toBeNull();
  });

  it('adds the imported sprites to the sheet after making them', () => {
    const steps = importSteps({ ...run, sheetId: 'sheet-1' }, null);
    expect(steps.map((step) => step.name)).toEqual(['sprite.import', 'sprite.import', COMMAND_NAME.sheetAdd]);
    expect(steps[2]?.options).toEqual({ sheet: 'sheet-1' });
    const sprites = steps[2]?.targets?.sprites ?? [];
    expect(sprites.map((each) => (typeof each === 'string' ? each : each.ref))).toEqual([steps[0]?.ref, steps[1]?.ref]);
  });

  it('makes only the sprites when no sheet was named or a new file is made', () => {
    expect(importSteps(run, null).map((step) => step.name)).toEqual(['sprite.import', 'sprite.import']);
    const fresh = { ...run, sheetId: 'sheet-1', form: { ...run.form, target: 'new' as const } };
    expect(importSteps(fresh, null).map((step) => step.name)).not.toContain(COMMAND_NAME.sheetAdd);
  });
});
