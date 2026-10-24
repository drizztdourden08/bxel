/* @layer renderer-app @kind component */
import { Button, Flex, ListItemList, ListItemRow, Stack, Text } from '@drizztdourden08/tessera';
import { PANEL_TEXT } from '../AssistantPanel.constants';
import type { PanelPartProps } from '../AssistantPanel.type';

const SessionList = ({ model }: PanelPartProps) => (
  <Stack gap="sm">
    <Text variant="label">{PANEL_TEXT.sessionsTitle}</Text>
    {model.sessions.length === 0 ? (
      <Text tone="muted">{PANEL_TEXT.sessionsEmpty}</Text>
    ) : (
      <ListItemList label={PANEL_TEXT.sessionsTitle}>
        {model.sessions.map((session) => (
          <ListItemRow
            key={session.sessionId}
            name={session.displayName}
            meta={PANEL_TEXT.connected(session.mode, session.trust)}
            actionVisibility="always"
            action={
              <Flex gap="sm" align="center">
                <Button size="sm" variant="secondary" onClick={() => model.setSessionMode(session.sessionId, session.mode === 'edit' ? 'read' : 'edit')}>
                  {session.mode === 'edit' ? PANEL_TEXT.makeReadOnly : PANEL_TEXT.allowEditing}
                </Button>
                <Button size="sm" variant="danger" onClick={() => model.disconnect(session.sessionId)}>
                  {PANEL_TEXT.disconnect}
                </Button>
              </Flex>
            }
          />
        ))}
      </ListItemList>
    )}
  </Stack>
);

export { SessionList };
