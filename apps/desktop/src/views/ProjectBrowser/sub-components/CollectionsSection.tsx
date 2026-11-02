/* @layer renderer-app @kind component */
import { Button } from '@drizztdourden08/tessera';
import { collectionQuery } from '../../../project-browser/collection-query';
import { collectionTree } from '../../../project-browser/collection-tree';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { useBrowserContext } from '../behavior/useBrowserContext';
import { useSourceDrops } from '../behavior/useSourceDrops';
import { CollectionNameField } from './CollectionNameField';
import { SourceSection } from './SourceSection';
import { SourceTree } from './SourceTree';

const CollectionsSection = () => {
  const { model, actions } = useBrowserContext();
  const drops = useSourceDrops();
  const query = useBrowserStore((state) => state.query);
  const { collections } = model.organise;
  const active = collections.find((each) => collectionQuery(each.name) === query);
  return (
    <SourceSection title={BROWSER_TEXT.collections} empty={collections.length === 0 ? BROWSER_TEXT.noCollections : undefined}>
      {collections.length > 0 && (
        <SourceTree
          label={BROWSER_TEXT.collections}
          root={collectionTree(model.organise, model.everyFile)}
          selectedKey={active?.id ?? null}
          drop={drops.collections}
          onSelect={(key) => useBrowserStore.getState().setQuery(collectionQuery(collections.find((each) => each.id === key)?.name ?? ''))}
        />
      )}
      {model.editable && active !== undefined && (
        <Button size="sm" variant="ghost" onClick={() => actions.deleteCollection(active.id)}>
          {BROWSER_TEXT.deleteCollection(active.name)}
        </Button>
      )}
      {model.editable && <CollectionNameField />}
    </SourceSection>
  );
};

export { CollectionsSection };
