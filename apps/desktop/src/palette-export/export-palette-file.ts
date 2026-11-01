/* @layer renderer-app @kind logic */
import { getPlatform, toast } from '@drizztdourden08/brock-react';
import type { PaletteTarget } from '../editor/editor.type';
import { safeName } from '../export/safe-name';
import { EXPORT_WRITE } from '../files/files.constants';
import { fileName } from '../files/file-name';
import { PALETTE_EXPORT_FORMATS, PALETTE_EXPORT_TEXT } from './palette-export.constants';
import type { PaletteExportId } from './palette-export.type';
import { paletteExportBytes } from './palette-export-bytes';
import { paletteFileOf } from './palette-file-of';

/** Asks for a place, then writes the palette, or only the given swatches, in one of the formats. */
const exportPaletteFile = async (target: PaletteTarget, id: PaletteExportId, indices: readonly number[] | null): Promise<void> => {
  const format = PALETTE_EXPORT_FORMATS.find((each) => each.id === id);
  const file = paletteFileOf(target.bank, indices);
  const { documents } = getPlatform();
  if (!format || file.colors.length === 0) {
    toast(PALETTE_EXPORT_TEXT.none, { variant: 'info' });
    return;
  }
  const made = paletteExportBytes(file, format);
  if (!made.ok) {
    toast(PALETTE_EXPORT_TEXT.failed(made.message), { variant: 'danger' });
    return;
  }
  if (!documents) {
    toast(PALETTE_EXPORT_TEXT.noDialog, { variant: 'danger' });
    return;
  }
  const stem = safeName(target.bank.name) || PALETTE_EXPORT_TEXT.fallbackName;
  const scale = format.scale > 1 ? `-${format.scale}x` : '';
  const path = await documents.saveAs({
    title: PALETTE_EXPORT_TEXT.title,
    defaultPath: `${stem}${indices === null ? '' : '-selection'}${scale}.${format.extension}`,
    filters: [{ name: format.label, extensions: [format.extension] }],
  });
  if (path === null) return;
  try {
    await documents.write(path, made.bytes, EXPORT_WRITE);
    toast(PALETTE_EXPORT_TEXT.exported(file.colors.length, fileName(path)), { variant: 'success' });
  } catch (error) {
    toast(PALETTE_EXPORT_TEXT.failed(error instanceof Error ? error.message : ''), { variant: 'danger' });
  }
};

export { exportPaletteFile };
