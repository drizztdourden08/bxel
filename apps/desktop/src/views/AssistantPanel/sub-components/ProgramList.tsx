/* @layer renderer-app @kind component */
import { Button, Flex, ListItemList, ListItemRow, SettingsSection, Stack, Text } from '@drizztdourden08/tessera';
import { PANEL_TEXT } from '../AssistantPanel.constants';
import type { PanelPartProps } from '../AssistantPanel.type';
import { presetOf } from '../behavior/preset-of';
import { PresetSelect } from './PresetSelect';

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
                  <PresetSelect
                    name={PANEL_TEXT.programPreset(program.displayName)}
                    value={presetOf(program.grant)}
                    onChange={(choice) => model.setProgramPreset(program.key, choice)}
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    aria-expanded={model.permissionsKey === program.key}
                    aria-label={PANEL_TEXT.permissionsFor(program.displayName)}
                    onClick={() => model.togglePermissions(program.key)}
                  >
                    {PANEL_TEXT.permissions}
                  </Button>
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
