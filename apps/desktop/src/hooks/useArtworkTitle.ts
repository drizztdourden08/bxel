/* @layer renderer-app @kind hook */
import { useDocumentTitle } from '@drizztdourden08/brock-react';
import { titleInProject } from '../project/title-in-project';
import { useProjectStore } from '../stores/useProjectStore';
import { useActiveAsset } from './useActiveAsset';

const useArtworkTitle = (): void => {
  const asset = useActiveAsset();
  const project = useProjectStore((state) => state.project);
  useDocumentTitle(asset ? { name: titleInProject(asset.name, asset.path, project), dirty: asset.anyDirty } : null);
};

export { useArtworkTitle };
