/* @layer renderer-app @kind component */
import { Box, Button, Text } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { useBrowserContext } from '../behavior/useBrowserContext';

const BrowserStatus = () => {
  const { model } = useBrowserContext();
  return (
    <Box className="browser-status" role="status">
      <Button size="sm" variant="ghost" onClick={() => useBrowserStore.getState().setQuery('')}>
        {BROWSER_TEXT.statusFiles(model.searching ? model.files.length : model.total)}
      </Button>
      {model.selected.length > 0 && (
        <Text as="span" variant="caption" tone="muted">
          {BROWSER_TEXT.statusSelected(model.selected.length)}
        </Text>
      )}
      {model.unsaved > 0 && (
        <Button size="sm" variant="ghost" onClick={() => useBrowserStore.getState().setQuery('is:unsaved')}>
          {BROWSER_TEXT.statusUnsaved(model.unsaved)}
        </Button>
      )}
      {!model.editable && (
        <Text as="span" variant="caption" tone="muted">
          {BROWSER_TEXT.readOnly}
        </Text>
      )}
    </Box>
  );
};

export { BrowserStatus };
