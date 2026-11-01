/* @layer renderer-app @kind logic */
import type { PaletteTarget } from '../editor/editor.type';
import { safeName } from '../export/safe-name';
import { PALETTE_EXPORT_TEXT } from './palette-export.constants';
import type { PaletteExportFormat } from './palette-export.type';

const paletteDefaultPath = (target: PaletteTarget, format: PaletteExportFormat, selection: boolean): string => {
  const stem = safeName(target.bank.name) || PALETTE_EXPORT_TEXT.fallbackName;
  const scale = format.scale > 1 ? `-${format.scale}x` : '';
  return `${stem}${selection ? '-selection' : ''}${scale}.${format.extension}`;
};

export { paletteDefaultPath };
