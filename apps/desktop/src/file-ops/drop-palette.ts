/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { createProjectPalette } from '../project-config/create-project-palette';
import { paletteDraft } from '../project-config/palette-draft';
import { SOURCE_DEFAULT } from '../palette-source/palette-source.constants';
import { readPaletteFile } from '../palette-source/read-palette-file';

const dropPalette = async (file: File, defaults: Parameters<typeof paletteDraft>[1]): Promise<void> => {
  const read = readPaletteFile(new Uint8Array(await file.arrayBuffer()), file.name);
  if (!read.ok) {
    toast(read.message, { variant: 'warning' });
    return;
  }
  const failed = await createProjectPalette(paletteDraft({ ...SOURCE_DEFAULT, kind: 'file', file: read.palette }, defaults));
  if (failed !== null) toast(failed, { variant: 'danger' });
};

export { dropPalette };
