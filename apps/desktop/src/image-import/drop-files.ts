/* @layer renderer-app @kind logic */
import type { DroppedFiles } from '@drizztdourden08/brock-react';
import type { DragAsset } from '../asset-drag/asset-drag.type';
import { dropImage } from './drop-image';
import { isImageFile } from './is-image-file';

const dropFiles = (payload: DroppedFiles | readonly DragAsset[]): payload is DroppedFiles => {
  if (!('files' in payload)) return false;
  const file = payload.files.map((each) => each.file).find(isImageFile);
  if (file) void dropImage(file);
  return true;
};

export { dropFiles };
