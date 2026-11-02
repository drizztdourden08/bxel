/* @layer renderer-app @kind logic */
import type { CommandStep } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import { alphaThreshold } from './alpha-threshold';
import { cropRgba } from './crop-rgba';
import { TILESET_REF } from './image-import.constants';
import type { BankOption, ImportRun } from './image-import.type';

const tilesetImportSteps = (run: ImportRun, bank: BankOption): CommandStep[] => {
  const { form, image, rects } = run;
  const [first] = rects;
  if (!first) return [];
  const tiles = rects.map((rect) => ({
    image: { width: rect.width, height: rect.height, rgba: cropRgba(image, rect) },
    originX: rect.x,
    originY: rect.y,
  }));
  return [
    {
      name: PALETTE_COMMAND_NAME.tilesetImport,
      targets: null,
      ref: TILESET_REF,
      options: {
        name: form.name.trim(),
        tileWidth: first.width,
        tileHeight: first.height,
        bank,
        mapping: { dither: form.dither, alphaThreshold: alphaThreshold(form.alphaPercent) },
        tiles,
      },
    },
  ];
};

export { tilesetImportSteps };
