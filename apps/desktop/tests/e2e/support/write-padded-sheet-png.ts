/* @layer renderer-app @kind logic */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { encodePngRgba } from '@bxel/formats';
import { PADDED_COLOURS, PADDED_MARKS, PADDED_SHEET } from './padded-sheet.constants';

const writePaddedSheetPng = async (dir: string): Promise<string> => {
  const { width, height, offset, spacing, cell } = PADDED_SHEET;
  const data = new Uint8ClampedArray(width * height * 4);
  PADDED_MARKS.forEach((marks, at) => {
    const left = offset + at * (cell + spacing);
    for (const mark of marks) data.set([...(PADDED_COLOURS[at] ?? [0, 0, 0]), 255], ((offset + mark.y) * width + left + mark.x) * 4);
  });
  const png = encodePngRgba({ width, height, data });
  if (!png.ok) throw new Error(png.message);
  const path = join(dir, PADDED_SHEET.file);
  await writeFile(path, png.bytes);
  return path;
};

export { writePaddedSheetPng };
