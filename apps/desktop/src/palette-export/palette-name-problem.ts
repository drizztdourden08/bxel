/* @layer renderer-app @kind logic */
import { fileExtension } from '../files/file-extension';
import type { PaletteExportFormatName } from './palette-file-tool.type';

/** A palette file is named after its format, so a .gpl is never a JASC list. Null when the name fits. */
const paletteNameProblem = (format: PaletteExportFormatName, name: string): string | null =>
  fileExtension(name) === format ? null : `A ${format} palette file name must end in .${format}.`;

export { paletteNameProblem };
