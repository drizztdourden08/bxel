/* @layer renderer-app @kind logic */
import type { AssetDefaults } from '@bxel/project';
import { dropImage } from '../image-import/drop-image';
import { dropKind } from './drop-kind';
import { dropPalette } from './drop-palette';

const dropImageAndPalettes = async (files: readonly File[], defaults: AssetDefaults): Promise<void> => {
  const image = files.find((file) => dropKind(file) === 'image');
  if (image) void dropImage(image);
  for (const file of files.filter((each) => dropKind(each) === 'palette')) await dropPalette(file, defaults);
};

export { dropImageAndPalettes };
