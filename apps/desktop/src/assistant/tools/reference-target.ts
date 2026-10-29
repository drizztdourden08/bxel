/* @layer renderer-app @kind logic */
import { comparablePath } from '@bxel/project';
import type { IndexedFile, LinkIndex } from '../../workspace/link-index.type';
import type { FindReferencesInput } from './project-files-input.type';
import type { AssetFile } from './reference-target.type';

const isAsset = (file: IndexedFile | undefined): file is AssetFile => file !== undefined && file.kind !== 'project';

const referenceTarget = (index: LinkIndex, request: FindReferencesInput, path: string | null): AssetFile | undefined => {
  const found =
    request.assetId === undefined
      ? index.files.find((file) => comparablePath(file.path) === comparablePath(path ?? ''))
      : index.files.find((file) => file.assetId === request.assetId);
  return isAsset(found) ? found : undefined;
};

export { referenceTarget };
