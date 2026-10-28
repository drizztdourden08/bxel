/* @layer renderer-app @kind component */
import { Box, Icon, IconButton } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { useBrowserContext } from '../behavior/useBrowserContext';
import { Breadcrumbs } from './Breadcrumbs';
import { CreateMenu } from './CreateMenu';
import { SearchBar } from './SearchBar';
import { ViewControls } from './ViewControls';

const BrowserToolbar = () => {
  const { model } = useBrowserContext();
  const canBack = useBrowserStore((state) => state.past.length > 0);
  const canForward = useBrowserStore((state) => state.future.length > 0);
  const preview = useBrowserStore((state) => state.preview);
  return (
    <Box className="browser-toolbar" role="toolbar" aria-label={BROWSER_TEXT.windowTitle}>
      <Box className="browser-toolbar__row">
        <IconButton label={BROWSER_TEXT.back} size="sm" variant="tertiary" disabled={!canBack} onClick={() => useBrowserStore.getState().goBack()}>
          <Icon name="arrow-left" />
        </IconButton>
        <IconButton label={BROWSER_TEXT.forward} size="sm" variant="tertiary" disabled={!canForward} onClick={() => useBrowserStore.getState().goForward()}>
          <Icon name="arrow-right" />
        </IconButton>
        <IconButton label={BROWSER_TEXT.up} size="sm" variant="tertiary" disabled={model.parentFolder === null} onClick={() => useBrowserStore.getState().goTo(model.parentFolder)}>
          <Icon name="arrow-up" />
        </IconButton>
        <Breadcrumbs />
        <CreateMenu />
        <IconButton label={BROWSER_TEXT.refresh} size="sm" variant="tertiary" onClick={model.refresh}>
          <Icon name="refresh-cw" />
        </IconButton>
        <IconButton
          label={preview ? BROWSER_TEXT.previewHide : BROWSER_TEXT.previewShow}
          size="sm"
          variant="tertiary"
          active={preview}
          aria-pressed={preview}
          onClick={() => useBrowserStore.getState().togglePreview()}
        >
          <Icon name="panel-right" />
        </IconButton>
      </Box>
      <Box className="browser-toolbar__row">
        <SearchBar />
        <ViewControls />
      </Box>
    </Box>
  );
};

export { BrowserToolbar };
