/* @layer renderer-app @kind component */
import { Box, Button, SearchInput, Tag } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { useBrowserContext } from '../behavior/useBrowserContext';

const without = (text: string, token: string): string => text.split(/\s+/).filter((each) => each !== '' && each !== token).join(' ');

const SearchBar = () => {
  const { model } = useBrowserContext();
  const query = useBrowserStore((state) => state.query);
  const setQuery = useBrowserStore((state) => state.setQuery);
  const saved = useBrowserStore((state) => state.smart).find((filter) => filter.query === query);
  return (
    <Box className="browser-search">
      <SearchInput value={query} onChange={setQuery} placeholder={BROWSER_TEXT.searchPlaceholder} aria-label={BROWSER_TEXT.searchLabel} title={BROWSER_TEXT.searchHelp} />
      {model.query.chips.length > 0 && (
        <Box className="browser-search__chips" role="group" aria-label="Search filters">
          {model.query.chips.map((chip) => (
            <Tag key={chip.text} name={chip.label} onRemove={() => setQuery(without(query, chip.text))}>
              {chip.label}
            </Tag>
          ))}
          {model.editable && saved === undefined && (
            <Button size="sm" variant="ghost" onClick={() => useBrowserStore.getState().addSmart(query.trim(), query.trim())}>
              {BROWSER_TEXT.saveFilter}
            </Button>
          )}
          {saved !== undefined && (
            <Button size="sm" variant="ghost" onClick={() => useBrowserStore.getState().removeSmart(saved.id)}>
              {BROWSER_TEXT.removeFilter(saved.name)}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export { SearchBar };
