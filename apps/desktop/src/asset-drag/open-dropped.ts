/* @layer renderer-app @kind logic */
import { entryKindOf } from '@bxel/project';
import { nav } from '@drizztdourden08/brock-react';
import { openImage } from '../asset-list/open-image';
import { fileName } from '../files/file-name';
import { runFileAction } from '../files/run-file-action';
import type { DragAsset } from './asset-drag.type';

const openable = (asset: DragAsset): boolean => asset.kind !== 'folder' && asset.path !== '' && (asset.kind !== 'other' || entryKindOf(fileName(asset.path)) === 'legacy');

const openDropped = (assets: readonly DragAsset[]): number => {
  const picked = assets.filter(openable);
  for (const asset of picked) {
    if (asset.kind === 'image') void openImage(asset.path);
    else void runFileAction({ kind: 'openPath', path: asset.path });
  }
  if (picked.length > 0) nav.close();
  return picked.length;
};

export { openDropped };
