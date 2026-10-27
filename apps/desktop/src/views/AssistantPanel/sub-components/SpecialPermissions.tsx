/* @layer renderer-app @kind component */
import { Callout, SettingsSection, Stack, Toggle } from '@drizztdourden08/tessera';
import { GRANT_TEXT_UI } from '../ProgramGrant.constants';
import type { SpecialPermissionsProps } from './SpecialPermissions.type';

const SpecialPermissions = ({ mayRestart, onMayRestart }: SpecialPermissionsProps) => (
  <SettingsSection id="special" title={GRANT_TEXT_UI.specialTitle} description={GRANT_TEXT_UI.specialHint}>
    <Stack gap="sm">
      <Callout tone="warning">{GRANT_TEXT_UI.specialWarning}</Callout>
      <Toggle checked={mayRestart} onChange={onMayRestart} label={GRANT_TEXT_UI.restartLabel} description={GRANT_TEXT_UI.restartHint} />
    </Stack>
  </SettingsSection>
);

export { SpecialPermissions };
