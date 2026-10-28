/* @layer renderer-app @kind component */
import { Box, Button, GroupTree, Icon, IconButton, Text } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import { buildFolderTree } from '../../../project-browser/folder-tree';
import { matchEntry } from '../../../project-browser/match-entry';
import { parseQuery } from '../../../project-browser/parse-query';
import { BROWSER_TEXT, BUILT_IN_FILTERS } from '../../../project-browser/project-browser.constants';
import type { SmartFilter } from '../../../project-browser/project-browser.type';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { useBrowserContext } from '../behavior/browser-context';

const FilterRow = ({ filter, count, removable }: { readonly filter: SmartFilter; readonly count: number; readonly removable: boolean }) => {
  const query = useBrowserStore((state) => state.query);
  return (
    <Box className="browser-source-row">
      <Button size="sm" variant="ghost" aria-pressed={query === filter.query} onClick={() => useBrowserStore.getState().setQuery(query === filter.query ? '' : filter.query)}>
        <Text as="span" variant="caption">{filter.name}</Text>
        <Text as="span" variant="caption" tone="muted">{count}</Text>
      </Button>
      {removable && (
        <IconButton label={BROWSER_TEXT.removeFilter(filter.name)} size="xs" variant="tertiary" onClick={() => useBrowserStore.getState().removeSmart(filter.id)}>
          <Icon name="x" />
        </IconButton>
      )}
    </Box>
  );
};

/** The left pane: the folders as a tree, the files pinned by the owner, and the saved searches. */
const SourcesPane = () => {
  const { model } = useBrowserContext();
  const smart = useBrowserStore((state) => state.smart);
  const tree = useMemo(() => buildFolderTree(model.projectName, model.roots, model.folderPaths, model.everyFile.map((entry) => entry.row)), [model.projectName, model.roots, model.folderPaths, model.everyFile]);
  const pinned = model.everyFile.filter((entry) => entry.pinned);
  const filters = [...BUILT_IN_FILTERS.map((filter) => ({ filter, removable: false })), ...smart.map((filter) => ({ filter, removable: true }))];
  const counts = useMemo(
    () => new Map(filters.map(({ filter }) => [filter.id, model.everyFile.filter((entry) => matchEntry(entry, parseQuery(filter.query))).length] as const)),
    [filters, model.everyFile],
  );
  const single = model.roots.length === 1 ? model.roots[0]?.path : undefined;
  return (
    <Box as="aside" className="browser-sources" aria-label={BROWSER_TEXT.sources}>
      <Text as="h3" variant="overline" tone="muted">{BROWSER_TEXT.folders}</Text>
      <GroupTree<never>
        root={tree}
        getItemKey={() => ''}
        renderItem={() => null}
        label={BROWSER_TEXT.folders}
        expandToDepth={2}
        selectedKey={model.folder ?? single ?? ''}
        onSelect={(key) => useBrowserStore.getState().goTo(key === '' ? null : key)}
      />
      <Text as="h3" variant="overline" tone="muted">{BROWSER_TEXT.pinned}</Text>
      {pinned.length === 0 ? (
        <Text as="p" variant="caption" tone="muted">{BROWSER_TEXT.noPinned}</Text>
      ) : (
        pinned.map((entry) => (
          <Button key={entry.id} size="sm" variant="ghost" onClick={() => useBrowserStore.getState().select({ ids: [entry.id], anchor: entry.id })}>
            <Icon name="pin" size="sm" />
            <Text as="span" variant="caption">{entry.row.name}</Text>
          </Button>
        ))
      )}
      <Text as="h3" variant="overline" tone="muted">{BROWSER_TEXT.filters}</Text>
      {filters.map(({ filter, removable }) => (
        <FilterRow key={filter.id} filter={filter} count={counts.get(filter.id) ?? 0} removable={removable} />
      ))}
    </Box>
  );
};

export { SourcesPane };
