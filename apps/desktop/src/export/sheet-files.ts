/* @layer renderer-app @kind logic */
import type { ExportedSheet } from '@bxel/formats';
import { encodeImage } from './encode-image';
import { EXPORT_TEXT, IMAGE_EXTENSION } from './export.constants';
import type { ColourMap, PlannedFile } from './export.type';

const sheetFiles = (sheet: ExportedSheet, map: ColourMap | null, spriteIndex: number): PlannedFile[] => {
  const imageName = sheet.metadata.image;
  const jsonName = imageName.replace(IMAGE_EXTENSION, '.json');
  const { width, height } = sheet.image;
  return [
    {
      name: imageName,
      detail: EXPORT_TEXT.imageDetail(imageName, width, height),
      spriteIndex,
      width,
      height,
      make: () => (map === null ? { ok: true, data: { kind: 'bytes', bytes: sheet.png } } : encodeImage(sheet.image, map)),
    },
    {
      name: jsonName,
      detail: EXPORT_TEXT.jsonDetail(jsonName, sheet.metadata.sprites.length),
      spriteIndex,
      width: null,
      height: null,
      make: () => ({ ok: true, data: { kind: 'text', text: sheet.json } }),
    },
  ];
};

export { sheetFiles };
