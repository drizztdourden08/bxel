/* @layer renderer-app @kind component */
import { Button, EmptyState, Flex, Icon, IconButton, ListItemList, ListItemRow, Stack, Text } from '@drizztdourden08/tessera';
import { PANEL_TEXT } from '../../../project/project.constants';
import type { PanelPartProps } from '../ProjectPanel.type';

const ProjectStart = ({ model }: PanelPartProps) => (
  <Stack gap="md">
    <EmptyState
      title={PANEL_TEXT.emptyTitle}
      message={PANEL_TEXT.emptyMessage}
      action={
        <Flex gap="sm" wrap>
          <Button variant="primary" size="sm" onClick={model.newProject}>
            New project
          </Button>
          <Button variant="secondary" size="sm" onClick={model.openProject}>
            Open project
          </Button>
        </Flex>
      }
    />
    {model.recents.length > 0 && (
      <Stack gap="xs">
        <Text variant="label">{PANEL_TEXT.recent}</Text>
        <ListItemList label={PANEL_TEXT.recent}>
          {model.recents.map((entry) => (
            <ListItemRow
              key={entry.rootRealPath}
              icon={<Icon name="folder" />}
              name={entry.name}
              meta={entry.rootRealPath}
              actionVisibility="always"
              action={
                <IconButton label={`${PANEL_TEXT.removeRecent}: ${entry.name}`} size="xs" onClick={() => model.removeRecent(entry)}>
                  <Icon name="x" />
                </IconButton>
              }
              onClick={() => model.openRecent(entry.rootRealPath)}
            />
          ))}
        </ListItemList>
      </Stack>
    )}
  </Stack>
);

export { ProjectStart };
