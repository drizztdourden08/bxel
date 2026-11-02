/* @layer renderer-app @kind logic */
import { isImageFile } from '../image-import/is-image-file';
import { assetEntries } from '../sheet-manager/asset-entries';
import type { MapDropPayload } from './tile-drag.type';

const canDropOnMap = (payload: MapDropPayload, overCell: boolean): boolean => {
  if ('key' in payload) return overCell;
  if ('files' in payload) return payload.files.some((each) => isImageFile(each.file));
  return assetEntries(payload).some((entry) => entry.kind === 'sprite');
};

export { canDropOnMap };
