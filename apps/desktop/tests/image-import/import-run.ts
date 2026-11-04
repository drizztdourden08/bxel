/* @layer renderer-app @kind test */
import type { ImportRun } from '../../src/image-import/image-import.type';

const importRun = (fileName: string, form: ImportRun['form'], bankId: string | null, names: string[]): ImportRun => ({
  form,
  image: { fileName, width: 4, height: 2, data: new Uint8ClampedArray(4 * 2 * 4).fill(255) },
  plan: { palette: [], transparent: true, limit: 16, bank: null, bankId, dropped: 0 },
  rects: [
    { index: 0, x: 0, y: 0, width: 2, height: 2 },
    { index: 1, x: 2, y: 0, width: 2, height: 2 },
  ],
  names,
  context: { documentId: null, bank: null, taken: [], animationNames: [], sheetNames: [], tilesetNames: [], tilemapNames: [], spriteCount: 0 },
  tiled: null,
});

export { importRun };
