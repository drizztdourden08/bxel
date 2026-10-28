/* @layer renderer-app @kind component */
import { Button, EmptyState } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { useBrowserContext } from '../behavior/useBrowserContext';

const EmptyCentre = () => {
  const { model, actions } = useBrowserContext();
  if (model.searching) {
    return (
      <EmptyState
        title={BROWSER_TEXT.emptySearchTitle}
        message={BROWSER_TEXT.emptySearchMessage}
        action={
          <Button size="sm" variant="secondary" onClick={() => useBrowserStore.getState().setQuery('')}>
            {BROWSER_TEXT.clearSearch}
          </Button>
        }
      />
    );
  }
  return (
    <EmptyState
      title={BROWSER_TEXT.emptyFolderTitle}
      message={BROWSER_TEXT.emptyFolderMessage}
      action={
        model.editable ? (
          <Button size="sm" variant="primary" onClick={() => actions.newAsset('sprite')}>
            New sprite
          </Button>
        ) : undefined
      }
    />
  );
};

export { EmptyCentre };
