/* @layer renderer-app @kind component */
import { Button, EmptyState, Flex, Spinner } from '@drizztdourden08/tessera';
import { PANEL_UI } from '../ProjectPanel.constants';
import type { PanelPartProps } from '../ProjectPanel.type';

const ProjectEmpty = ({ model }: PanelPartProps) => {
  const { data, project, search, rowActions, grantFolder } = model;
  const main = project?.folders[0];
  if (main && !main.granted) {
    return (
      <EmptyState
        message={PANEL_UI.notGranted}
        action={
          <Button variant="secondary" size="sm" onClick={() => grantFolder(main.path)}>
            {PANEL_UI.grant}
          </Button>
        }
      />
    );
  }
  if (!data.ready) return <Spinner size="md" label={PANEL_UI.loading} />;
  if (search.active || model.browser.filtered) {
    return (
      <EmptyState
        message={PANEL_UI.nothingMatches}
        action={
          <Button variant="secondary" size="sm" onClick={search.clear}>
            {PANEL_UI.clearFilters}
          </Button>
        }
      />
    );
  }
  return (
    <EmptyState
      title={PANEL_UI.emptyTitle}
      message={PANEL_UI.emptyMessage}
      action={
        <Flex gap="sm" wrap>
          <Button variant="primary" size="sm" onClick={() => rowActions.newAsset('sprite')}>
            Sprite
          </Button>
          <Button variant="secondary" size="sm" onClick={() => rowActions.newAsset('palette')}>
            Palette
          </Button>
          <Button variant="secondary" size="sm" onClick={() => rowActions.newAsset('sheet')}>
            Sheet
          </Button>
        </Flex>
      }
    />
  );
};

export { ProjectEmpty };
