/* @layer renderer-app @kind component */
import { Callout, Field, SearchInput, SettingsSection, Stack, Text } from '@drizztdourden08/tessera';
import { PANEL_TEXT } from '../AssistantPanel.constants';
import { GRANT_TEXT_UI } from '../ProgramGrant.constants';
import { useProgramGrant } from '../behavior/useProgramGrant';
import { BundleRow } from './BundleRow';
import { PresetSelect } from './PresetSelect';
import type { ProgramGrantProps } from './ProgramGrant.type';
import { SpecialPermissions } from './SpecialPermissions';

const ProgramGrant = ({ program, onGrant }: ProgramGrantProps) => {
  const model = useProgramGrant(program, onGrant);
  const searching = model.query.trim() !== '';
  return (
    <Stack gap="lg" role="group" aria-label={PANEL_TEXT.permissionsFor(program.displayName)}>
      <Stack gap="xs">
        <Text variant="title">{program.displayName}</Text>
        <Text tone="muted">{PANEL_TEXT.lastSeen(new Date(program.lastConnected).toLocaleString())}</Text>
      </Stack>
      <Field label={GRANT_TEXT_UI.presetLabel}>
        <PresetSelect name={PANEL_TEXT.programPreset(program.displayName)} value={model.preset} onChange={model.setPreset} />
      </Field>
      {program.grant.blocked ? (
        <Callout tone="info">{GRANT_TEXT_UI.blocked}</Callout>
      ) : (
        <>
          <SearchInput value={model.query} onChange={model.setQuery} aria-label={GRANT_TEXT_UI.searchLabel} placeholder={GRANT_TEXT_UI.searchPlaceholder} />
          <SettingsSection id="tools" title={GRANT_TEXT_UI.toolsTitle} description={GRANT_TEXT_UI.toolsHint}>
            <Stack gap="md">
              {model.rows.length === 0 && <Text tone="muted">{GRANT_TEXT_UI.noMatch}</Text>}
              {model.rows.map((row) => (
                <BundleRow key={row.id} row={row} searching={searching} onBundle={(level) => model.setBundle(row.id, level)} onTool={model.setTool} onFollow={model.followBundle} />
              ))}
            </Stack>
          </SettingsSection>
          <SpecialPermissions mayRestart={program.grant.special.mayRestart} onMayRestart={model.setMayRestart} />
        </>
      )}
    </Stack>
  );
};

export { ProgramGrant };
