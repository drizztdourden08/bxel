/* @layer renderer-app @kind component */
import { Box, Button, SearchInput, Tag } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { useBrowserContext } from '../behavior/browser-context';

const without = (text: string, token: string): string => text.split(/\s+/).filter((each) => each !== '' && each !== token).join(' ');

/** One box for words and tokens. Every token typed is shown again as a chip that can be taken off. */
const SearchBar = () => {
  const { model } = useBrowserContext();
  const query = useBrowserStore((state) => state.query);
  const setQuery = useBrowserStore((state) => state.setQuery);
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
          {model.editable && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                const name = query.trim();
                if (name !== '') useBrowserStore.getState().addSmart(name, name);
              }}
            >
              {BROWSER_TEXT.saveFilter}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export { SearchBar };
