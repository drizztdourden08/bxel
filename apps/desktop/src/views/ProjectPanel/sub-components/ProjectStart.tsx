/* @layer renderer-app @kind component */
import { contextMenuZone } from '@drizztdourden08/brock-react';
import { Button, EmptyState, Flex, Icon, IconButton, ListItemList, ListItemRow, ScrollArea, Stack, Text } from '@drizztdourden08/tessera';
import { PANEL_UI, PROJECT_MENU } from '../ProjectPanel.constants';
import type { PanelPartProps } from '../ProjectPanel.type';

const ProjectStart = ({ model }: PanelPartProps) => (
  <ScrollArea axis="y" scrollbar="slim" fade={false}>
    <Stack gap="md" {...contextMenuZone(PROJECT_MENU.zone)}>
      <EmptyState
        title={PANEL_UI.noProjectTitle}
        message={PANEL_UI.noProjectMessage}
        action={
          <Flex gap="sm" wrap>
            <Button variant="primary" size="sm" onClick={model.newProject}>
              {PANEL_UI.newProject}
            </Button>
            <Button variant="secondary" size="sm" onClick={model.openProject}>
              {PANEL_UI.openProject}
            </Button>
            <Button variant="ghost" size="sm" onClick={model.openDemo}>
              {PANEL_UI.openDemo}
            </Button>
          </Flex>
        }
      />
      {model.recents.length > 0 && (
        <Stack gap="xs">
          <Text variant="label">{PANEL_UI.recent}</Text>
          <ListItemList label={PANEL_UI.recent}>
            {model.recents.map((entry) => (
              <ListItemRow
                key={entry.rootRealPath}
                icon={<Icon name="folder" />}
                name={entry.name}
                meta={entry.rootRealPath}
                actionVisibility="always"
                action={
                  <IconButton label={`${PANEL_UI.removeRecent}: ${entry.name}`} size="xs" onClick={() => model.removeRecent(entry)}>
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
  </ScrollArea>
);

export { ProjectStart };
