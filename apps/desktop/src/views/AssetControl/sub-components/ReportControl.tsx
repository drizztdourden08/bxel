/* @layer renderer-app @kind component */
import { Checkbox, Stack, Text } from '@drizztdourden08/tessera';
import { PLATFORM_TEXT, STRICT_TEXT } from '../../../platform-preset/platform-preset.constants';
import { PlatformFindings } from '../../PlatformFindings';
import { useReportControl } from '../behavior/useReportControl';
import { SnapRow } from './SnapRow';

const ReportControl = () => {
  const model = useReportControl();
  if (model.report === null) {
    return (
      <Text variant="caption" tone="muted">
        {PLATFORM_TEXT.noRules}
      </Text>
    );
  }
  return (
    <Stack gap="xs">
      <Checkbox size="sm" label={STRICT_TEXT.label} help={STRICT_TEXT.hint} checked={model.report.strict} onChange={model.toggleStrict} />
      {model.caption !== '' && (
        <Text variant="caption" tone="muted">
          {model.caption}
        </Text>
      )}
      <PlatformFindings report={model.report} />
      <SnapRow />
    </Stack>
  );
};

export { ReportControl };
