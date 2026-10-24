/* @layer renderer-app @kind component */
import { Callout, Checkbox, Field, Select, Stack } from '@drizztdourden08/tessera';
import { PLATFORM_TEXT, STRICT_TEXT } from '../../../platform-preset/platform-preset.constants';
import { PlatformFindings } from '../../PlatformFindings';
import { usePlatformRow } from '../behavior/usePlatformRow';
import { PLATFORM_GROUPS } from '../PaletteSettings.constants';
import { SnapRow } from './SnapRow';

const PlatformRow = () => {
  const row = usePlatformRow();
  return (
    <Stack gap="xs">
      <Field label={PLATFORM_TEXT.label}>
        <Select searchable groups={PLATFORM_GROUPS} value={row.value} onChange={row.choose} />
      </Field>
      {row.unknown !== null && <Callout variant="footnote" tone="warning">{row.unknown}</Callout>}
      {row.report !== null && (
        <>
          <Checkbox size="sm" label={STRICT_TEXT.label} help={STRICT_TEXT.hint} checked={row.strict} onChange={row.toggleStrict} />
          <PlatformFindings report={row.report} />
          <SnapRow />
        </>
      )}
    </Stack>
  );
};

export { PlatformRow };
