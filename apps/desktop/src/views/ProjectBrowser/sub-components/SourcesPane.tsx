/* @layer renderer-app @kind component */
import { Box, Text } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import { buildFolderTree } from '../../../project-browser/folder-tree';
import { matchEntry } from '../../../project-browser/match-entry';
import { parseQuery } from '../../../project-browser/parse-query';
import { BROWSER_TEXT, BUILT_IN_FILTERS } from '../../../project-browser/project-browser.constants';
import { filterTree } from '../../../project-browser/filter-tree';
import { pinnedTree } from '../../../project-browser/pinned-tree';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { useBrowserContext } from '../behavior/useBrowserContext';
import { SourceTree } from './SourceTree';

const SourcesPane = () => {
  const { model } = useBrowserContext();
  const smart = useBrowserStore((state) => state.smart);
  const query = useBrowserStore((state) => state.query);
  const tree = useMemo(() => buildFolderTree(model.projectName, model.roots, model.folderPaths, model.everyFile.map((entry) => entry.row)), [model.projectName, model.roots, model.folderPaths, model.everyFile]);
  const pinned = useMemo(() => model.everyFile.filter((entry) => entry.pinned), [model.everyFile]);
  const filters = useMemo(() => [...BUILT_IN_FILTERS, ...smart], [smart]);
  const counts = useMemo(
    () => new Map(filters.map((filter) => [filter.id, model.everyFile.filter((entry) => matchEntry(entry, parseQuery(filter.query))).length] as const)),
    [filters, model.everyFile],
  );
  const single = model.roots.length === 1 ? model.roots[0]?.path : undefined;
  const active = filters.find((filter) => filter.query === query);
  return (
    <Box as="aside" className="browser-sources" aria-label={BROWSER_TEXT.sources}>
      <Box className="browser-sources__section">
        <Text as="h3" variant="overline" tone="muted">
          {BROWSER_TEXT.folders}
        </Text>
        <SourceTree label={BROWSER_TEXT.folders} root={tree} expandToDepth={2} selectedKey={model.folder ?? single ?? ''} onSelect={(key) => useBrowserStore.getState().goTo(key === '' ? null : key)} />
      </Box>
      <Box className="browser-sources__section">
        <Text as="h3" variant="overline" tone="muted">
          {BROWSER_TEXT.pinned}
        </Text>
        {pinned.length === 0 ? (
          <Text as="p" variant="caption" tone="muted" className="browser-sources__empty">
            {BROWSER_TEXT.noPinned}
          </Text>
        ) : (
          <SourceTree label={BROWSER_TEXT.pinned} root={pinnedTree(pinned)} selectedKey={null} onSelect={(key) => useBrowserStore.getState().select({ ids: [key], anchor: key })} />
        )}
      </Box>
      <Box className="browser-sources__section">
        <Text as="h3" variant="overline" tone="muted">
          {BROWSER_TEXT.filters}
        </Text>
        <SourceTree
          label={BROWSER_TEXT.filters}
          root={filterTree(filters, counts)}
          selectedKey={active?.id ?? null}
          onSelect={(key) => useBrowserStore.getState().setQuery(filters.find((filter) => filter.id === key)?.query ?? '')}
        />
      </Box>
    </Box>
  );
};

export { SourcesPane };
