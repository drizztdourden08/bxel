/* @layer renderer-app @kind component */
import { nav } from '@drizztdourden08/brock-react';
import { Box, Button, Text } from '@drizztdourden08/tessera';
import { PROJECT_HUB } from '../../../config-entry/config-entry.constants';
import { HEALTH_TEXT } from '../../../project-health/project-health.constants';
import { useHealthWatch } from '../../../project-health/useHealthWatch';
import { useProjectStore } from '../../../stores/useProjectStore';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { useBrowserContext } from '../behavior/useBrowserContext';

const BrowserStatus = () => {
  const { model } = useBrowserContext();
  const project = useProjectStore((state) => state.project);
  const health = useHealthWatch(model.editable ? project : null);
  const problems = health.status === 'ready' ? health.report.total : 0;
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
      {model.editable && problems > 0 && (
        <Button size="sm" variant="ghost" onClick={() => nav.open(`${PROJECT_HUB}/health`)}>
          {HEALTH_TEXT.badge(problems)}
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
