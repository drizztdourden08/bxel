/* @layer renderer-app @kind hook */
import { useDocumentTitle } from '@drizztdourden08/brock-react';
import { titleInProject } from '../project/title-in-project';
import { useImageTabStore } from '../stores/useImageTabStore';
import { useProjectStore } from '../stores/useProjectStore';
import { useActiveAsset } from './useActiveAsset';

const useArtworkTitle = (): void => {
  const asset = useActiveAsset();
  const project = useProjectStore((state) => state.project);
  const image = useImageTabStore((state) => state.tabs.find((tab) => tab.id === state.activeId));
  const open = image ? { name: titleInProject(image.name, image.path, project), dirty: false } : null;
  const shown = asset ? { name: titleInProject(asset.name, asset.path, project), dirty: asset.anyDirty } : null;
  useDocumentTitle(open ?? shown);
};

export { useArtworkTitle };
