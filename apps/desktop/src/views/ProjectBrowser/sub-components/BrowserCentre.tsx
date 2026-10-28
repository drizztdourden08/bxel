/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { useBrowserContext } from '../behavior/useBrowserContext';
import { ColumnsView } from './ColumnsView';
import { EmptyCentre } from './EmptyCentre';
import { GridView } from './GridView';
import { ListView } from './ListView';

const viewFor = (view: 'grid' | 'list' | 'columns') => {
  if (view === 'list') return ListView;
  return view === 'columns' ? ColumnsView : GridView;
};

const BrowserCentre = () => {
  const { model } = useBrowserContext();
  const view = useBrowserStore((state) => state.view);
  const Shown = viewFor(view);
  return (
    <Box className="browser-centre" data-view={view}>
      {model.entries.length === 0 && view !== 'columns' ? <EmptyCentre /> : <Shown />}
    </Box>
  );
};

export { BrowserCentre };
