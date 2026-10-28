/* @layer renderer-app @kind component */
import { Box, Button, EmptyState } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { useBrowserContext } from '../behavior/browser-context';
import { ColumnsView } from './ColumnsView';
import { GridView } from './GridView';
import { ListView } from './ListView';

const VIEWS = { grid: GridView, list: ListView, columns: ColumnsView } as const;

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
      icon={undefined}
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

/** The middle of the page: the files of the folder or of the search, in the view the owner picked. */
const BrowserCentre = () => {
  const { model } = useBrowserContext();
  const view = useBrowserStore((state) => state.view);
  const Shown = VIEWS[view];
  return (
    <Box className="browser-centre" data-view={view}>
      {model.entries.length === 0 && view !== 'columns' ? <EmptyCentre /> : <Shown />}
    </Box>
  );
};

export { BrowserCentre };
