/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { filterTree } from '../../../project-browser/filter-tree';
import { matchEntry } from '../../../project-browser/match-entry';
import { parseQuery } from '../../../project-browser/parse-query';
import { BROWSER_TEXT, BUILT_IN_FILTERS } from '../../../project-browser/project-browser.constants';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { useBrowserContext } from '../behavior/useBrowserContext';
import { SourceSection } from './SourceSection';
import { SourceTree } from './SourceTree';

const FiltersSection = () => {
  const { model } = useBrowserContext();
  const query = useBrowserStore((state) => state.query);
  const { smart } = model.organise;
  const filters = useMemo(() => [...BUILT_IN_FILTERS, ...smart], [smart]);
  const counts = useMemo(
    () => new Map(filters.map((filter) => [filter.id, model.everyFile.filter((entry) => matchEntry(entry, parseQuery(filter.query))).length] as const)),
    [filters, model.everyFile],
  );
  return (
    <SourceSection title={BROWSER_TEXT.filters}>
      <SourceTree
        label={BROWSER_TEXT.filters}
        root={filterTree(filters, counts)}
        selectedKey={filters.find((filter) => filter.query === query)?.id ?? null}
        onSelect={(key) => useBrowserStore.getState().setQuery(filters.find((filter) => filter.id === key)?.query ?? '')}
      />
    </SourceSection>
  );
};

export { FiltersSection };
