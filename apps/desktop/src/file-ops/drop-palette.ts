/* @layer renderer-app @kind logic */
import type { AssetDefaults } from '@bxel/project';
import { readPaletteFile } from '../palette-source/read-palette-file';
import { addPaletteFromRead } from '../project-config/add-palette-from-read';

const dropPalette = async (file: File, defaults: AssetDefaults): Promise<void> => {
  await addPaletteFromRead(readPaletteFile(new Uint8Array(await file.arrayBuffer()), file.name), defaults);
};

export { dropPalette };
