/* @layer renderer-app @kind logic */
import { exportSheet } from '@bxel/formats';
import { EXPORT_TEXT } from './export.constants';
import type { PlanParts, PlannedFile } from './export.type';
import { encodeImage } from './encode-image';
import { exportSprite } from './export-sprite';
import { sheetSettings } from './sheet-settings';

const planSheet = (parts: PlanParts): PlannedFile[] | string => {
  const { targets, settings, base, map } = parts;
  const imageName = `${base}.png`;
  const jsonName = `${base}.json`;
  const sheet = exportSheet({
    imageName,
    sprites: targets.map(exportSprite),
    settings: sheetSettings(targets, settings),
    trim: settings.trim,
    scale: settings.scale,
    flavour: settings.flavour,
  });
  if (!sheet.ok) return sheet.message;
  const last = targets.length - 1;
  const { width, height } = sheet.image;
  return [
    {
      name: imageName,
      detail: EXPORT_TEXT.imageDetail(imageName, width, height),
      spriteIndex: last,
      width,
      height,
      make: () => (map === null ? { ok: true, data: { kind: 'bytes', bytes: sheet.png } } : encodeImage(sheet.image, map)),
    },
    {
      name: jsonName,
      detail: EXPORT_TEXT.jsonDetail(jsonName, targets.length),
      spriteIndex: last,
      width: null,
      height: null,
      make: () => ({ ok: true, data: { kind: 'text', text: sheet.json } }),
    },
  ];
};

export { planSheet };
