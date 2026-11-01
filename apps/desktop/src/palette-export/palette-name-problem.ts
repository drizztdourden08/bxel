/* @layer renderer-app @kind logic */
import { fileExtension } from '../files/file-extension';
import type { PaletteExportFormatName } from './palette-file-tool.type';

const paletteNameProblem = (format: PaletteExportFormatName, name: string): string | null =>
  fileExtension(name) === format ? null : `A ${format} palette file name must end in .${format}.`;

export { paletteNameProblem };
