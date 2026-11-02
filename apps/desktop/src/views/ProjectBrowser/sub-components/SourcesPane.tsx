/* @layer renderer-app @kind component */
import { ScrollArea } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import { buildFolderTree } from '../../../project-browser/folder-tree';
import { pinnedTree } from '../../../project-browser/pinned-tree';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { useBrowserContext } from '../behavior/useBrowserContext';
import { useSourceDrops } from '../behavior/useSourceDrops';
import { CollectionsSection } from './CollectionsSection';
import { FiltersSection } from './FiltersSection';
import { SourceSection } from './SourceSection';
import { SourceTree } from './SourceTree';
import { TagsSection } from './TagsSection';

const SourcesPane = () => {
  const { model } = useBrowserContext();
  const drops = useSourceDrops();
  const tree = useMemo(() => buildFolderTree(model.projectName, model.roots, model.folderPaths, model.everyFile.map((entry) => entry.row)), [model.projectName, model.roots, model.folderPaths, model.everyFile]);
  const pinned = useMemo(() => model.everyFile.filter((entry) => entry.pinned), [model.everyFile]);
  const single = model.roots.length === 1 ? model.roots[0]?.path : undefined;
  return (
    <ScrollArea axis="y" scrollbar="slim" thumb="auto" fade={false} className="browser-sources" role="complementary" aria-label={BROWSER_TEXT.sources}>
      <SourceSection title={BROWSER_TEXT.folders}>
        <SourceTree label={BROWSER_TEXT.folders} root={tree} expandToDepth={2} selectedKey={model.folder ?? single ?? ''} drop={drops.folders} onSelect={(key) => useBrowserStore.getState().goTo(key === '' ? null : key)} />
      </SourceSection>
      <SourceSection title={BROWSER_TEXT.pinned} empty={pinned.length === 0 ? BROWSER_TEXT.noPinned : undefined}>
        {pinned.length > 0 && <SourceTree label={BROWSER_TEXT.pinned} root={pinnedTree(pinned)} selectedKey={null} onSelect={(key) => useBrowserStore.getState().select({ ids: [key], anchor: key })} />}
      </SourceSection>
      <CollectionsSection />
      <FiltersSection />
      <TagsSection />
    </ScrollArea>
  );
};

export { SourcesPane };
