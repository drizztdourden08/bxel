/* @layer renderer-app @kind component */
import type { ProgramMode } from '@bxel/mcp';
import { Button, Flex, ListItemList, ListItemRow, Select, SettingsSection, Stack, Text } from '@drizztdourden08/tessera';
import { PANEL_TEXT, PROGRAM_MODE_OPTIONS } from '../AssistantPanel.constants';
import type { PanelPartProps } from '../AssistantPanel.type';

const asMode = (value: string): ProgramMode => (value === 'edit' || value === 'blocked' ? value : 'read');

const ProgramList = ({ model }: PanelPartProps) => (
  <SettingsSection id="remembered" title={PANEL_TEXT.programsTitle} description={PANEL_TEXT.programsHint}>
    {model.programs.length === 0 ? (
      <Text tone="muted">{PANEL_TEXT.programsEmpty}</Text>
    ) : (
      <Stack gap="sm">
        <ListItemList label={PANEL_TEXT.programsTitle}>
          {model.programs.map((program) => (
            <ListItemRow
              key={program.key}
              name={program.displayName}
              meta={PANEL_TEXT.lastSeen(new Date(program.lastConnected).toLocaleString())}
              actionVisibility="always"
              action={
                <Flex gap="sm" align="center">
                  <Select
                    options={PROGRAM_MODE_OPTIONS}
                    value={program.mode}
                    onChange={(value) => model.setProgramMode(program.key, asMode(value))}
                    aria-label={PANEL_TEXT.programMode(program.displayName)}
                  />
                  <Button size="sm" variant="secondary" onClick={() => model.forget(program.key)}>
                    {PANEL_TEXT.forget}
                  </Button>
                </Flex>
              }
            />
          ))}
        </ListItemList>
        <Flex>
          <Button size="sm" variant="secondary" onClick={model.forgetAll}>
            {PANEL_TEXT.forgetAll}
          </Button>
        </Flex>
      </Stack>
    )}
  </SettingsSection>
);

export { ProgramList };
