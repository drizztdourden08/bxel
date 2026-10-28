/* @layer renderer-app @kind component */
import { Box, VirtualList } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import { useBrowserContext } from '../behavior/useBrowserContext';
import { LIST_COLUMNS } from '../ProjectBrowser.constants';
import { FileRow } from './FileRow';
import { ListHeadCell } from './ListHeadCell';

const ListView = () => {
  const { model } = useBrowserContext();
  return (
    <Box className="browser-list">
      <Box className="browser-head" role="group" aria-label={BROWSER_TEXT.sort}>
        {LIST_COLUMNS.map((column) => (
          <ListHeadCell key={column.label} column={column} />
        ))}
      </Box>
      <VirtualList
        className="browser-list__rows"
        label={BROWSER_TEXT.listLabel}
        items={model.entries}
        getKey={(entry) => entry.id}
        rowSize="compact"
        renderItem={(entry) => <FileRow entry={entry} />}
      />
    </Box>
  );
};

export { ListView };
