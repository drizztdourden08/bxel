/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import type { AssetDefaults } from '@bxel/project';
import { SOURCE_DEFAULT } from '../palette-source/palette-source.constants';
import type { PaletteRead } from '../palette-source/palette-source.type';
import { createProjectPalette } from './create-project-palette';
import { paletteDraft } from './palette-draft';

const addPaletteFromRead = async (read: PaletteRead, defaults: AssetDefaults): Promise<void> => {
  if (!read.ok) {
    toast(read.message, { variant: 'warning' });
    return;
  }
  const failed = await createProjectPalette(paletteDraft({ ...SOURCE_DEFAULT, kind: 'file', file: read.palette }, defaults));
  if (failed !== null) toast(failed, { variant: 'danger' });
};

export { addPaletteFromRead };
