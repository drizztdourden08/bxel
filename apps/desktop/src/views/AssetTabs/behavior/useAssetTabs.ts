/* @layer renderer-app @kind hook */
import type { DocumentTab } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import { useImageTabStore } from '../../../stores/useImageTabStore';
import { useWorkspaceStore } from '../../../stores/useWorkspaceStore';
import { assetName } from '../../../workspace/asset-name';
import { keyId } from '../../../workspace/key-id';
import { ASSET_ICON, IMAGE_ICON } from '../AssetTabs.constants';

const useAssetTabs = (): { readonly tabs: readonly DocumentTab[]; readonly activeId: string | undefined } => {
  const tabs = useWorkspaceStore((state) => state.tabs);
  const activeTab = useWorkspaceStore((state) => state.activeTab);
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const views = useDocumentStore((state) => state.views);
  const images = useImageTabStore((state) => state.tabs);
  const activeImage = useImageTabStore((state) => state.activeId);
  const shown = useMemo(
    () => [
      ...tabs.flatMap((tab): DocumentTab[] => {
        const artwork = views[tab.documentId]?.state.artwork;
        const title = artwork ? assetName(artwork, tab.key) : null;
        if (title === null) return [];
        const workspace = workspaces[tab.documentId];
        const tooltip = workspace?.paths.get(tab.key.id) ?? title;
        return [{ id: tab.id, title, icon: ASSET_ICON[tab.key.kind], unsaved: workspace?.dirty.has(keyId(tab.key)) ?? false, tooltip }];
      }),
      ...images.map((tab): DocumentTab => ({ id: tab.id, title: tab.name, icon: IMAGE_ICON, unsaved: false, tooltip: tab.path })),
    ],
    [tabs, views, workspaces, images],
  );
  return { tabs: shown, activeId: activeImage ?? activeTab ?? undefined };
};

export { useAssetTabs };
