/* @layer renderer-app @kind component */
import { Box, Text, VirtualList } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import { useBrowserContext } from '../behavior/useBrowserContext';
import { FileRow } from './FileRow';

const ColumnsView = () => {
  const { model } = useBrowserContext();
  const trail = useMemo(() => model.crumbs.map((crumb) => crumb.path), [model.crumbs]);
  return (
    <Box className="browser-columns" role="group" aria-label={BROWSER_TEXT.columnsLabel}>
      {trail.map((path, level) => {
        const next = trail[level + 1] ?? null;
        const entries = path === model.folder ? model.entries : model.entriesIn(path);
        return (
          <Box key={path ?? 'project'} className="browser-columns__column">
            {entries.length === 0 ? (
              <Text as="span" variant="caption" tone="muted">
                {BROWSER_TEXT.emptyFolderTitle}
              </Text>
            ) : (
              <VirtualList
                label={`${BROWSER_TEXT.folders} ${level + 1}`}
                items={entries}
                getKey={(entry) => entry.id}
                rowSize="compact"
                renderItem={(entry) => <FileRow entry={entry} column open={entry.kind === 'folder' && next !== null && entry.path.toLowerCase() === next.toLowerCase()} />}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export { ColumnsView };
