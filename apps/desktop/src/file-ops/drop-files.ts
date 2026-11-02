/* @layer renderer-app @kind logic */
import type { AssetDefaults } from '@bxel/project';
import { announce, toast } from '@drizztdourden08/brock-react';
import { fileKit } from '../files/file-kit';
import { dropImageAndPalettes } from './drop-image-and-palettes';
import { dropKind } from './drop-kind';
import { FILE_OPS_TEXT } from './file-ops.constants';
import { writeDropped } from './write-dropped';

const dropFiles = async (files: readonly File[], folder: string, defaults: AssetDefaults): Promise<void> => {
  const kit = fileKit();
  if (kit === null) {
    toast(FILE_OPS_TEXT.unavailable, { variant: 'warning' });
    return;
  }
  await dropImageAndPalettes(files, defaults);
  const result = await writeDropped(kit.documents, folder, files.filter((each) => dropKind(each) === 'copy'));
  if (result.written.length > 0) {
    const said = FILE_OPS_TEXT.dropped(result.written.length);
    toast(said, { variant: 'success' });
    announce(said);
  }
  if (result.failed.length > 0) toast(FILE_OPS_TEXT.dropFailed(result.failed), { variant: 'danger' });
};

export { dropFiles };
