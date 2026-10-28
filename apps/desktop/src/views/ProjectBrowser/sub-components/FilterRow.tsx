/* @layer renderer-app @kind component */
import { Box, Button, Icon, IconButton, Text } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import type { FilterRowProps } from '../ProjectBrowser.type';

const FilterRow = ({ filter, count, removable }: FilterRowProps) => {
  const query = useBrowserStore((state) => state.query);
  return (
    <Box className="browser-source-row">
      <Button size="sm" variant="ghost" aria-pressed={query === filter.query} onClick={() => useBrowserStore.getState().setQuery(query === filter.query ? '' : filter.query)}>
        <Text as="span" variant="caption">
          {filter.name}
        </Text>
        <Text as="span" variant="caption" tone="muted">
          {count}
        </Text>
      </Button>
      {removable && (
        <IconButton label={BROWSER_TEXT.removeFilter(filter.name)} size="xs" variant="tertiary" onClick={() => useBrowserStore.getState().removeSmart(filter.id)}>
          <Icon name="x" />
        </IconButton>
      )}
    </Box>
  );
};

export { FilterRow };
